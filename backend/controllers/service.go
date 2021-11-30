package controllers

import (
	"backend/models"
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

func (ctrl *Controller) GetServices(ctx *gin.Context) {
	serviceTypeQuery, isAnyQueryType := ctx.GetQuery("type")

	// check if there is a query URL "type"
	// and it has an invalid value
	isValid, serviceType := ctrl.Model.IsValidServiceType(serviceTypeQuery)
	if isAnyQueryType && !isValid {
		log.WithFields(log.Fields{
			"data": serviceTypeQuery,
		}).Error("Error on query type not valid")

		ctx.JSON(http.StatusBadRequest, gin.H{
			"ok":      false,
			"message": "Value of argument '?type=' is not valid",
		})
		return
	}

	switch serviceType {
	case models.AnalyticServiceType:
		ctrl.getServiceAnalytic(ctx)
	case models.SolutionServiceType:
		ctrl.getServiceSolution(ctx)
	case models.InnovationServiceType:
		ctrl.getServiceInnovation(ctx)
	default:
		ctrl.getAllServices(ctx)
	}
}

func (ctrl *Controller) getAllServices(ctx *gin.Context) {
	service := &models.Service{}
	analyticsService := &[]models.APIService{}

	if err := ctrl.DBConn.Model(service).Find(analyticsService).Error; err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"data":  analyticsService,
		}).Fatal("Can't Find Services")
	}

	ctx.JSON(http.StatusOK, gin.H{
		"ok":      true,
		"message": "Get all services success",
		"data":    &analyticsService,
	})
}

func (ctrl *Controller) getServiceAnalytic(ctx *gin.Context) {
	service := &models.Service{}
	analyticsService := &[]models.APIService{}

	if err := ctrl.DBConn.Model(service).Where("type = ?", "analytic").Find(analyticsService).Error; err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"data":  analyticsService,
		}).Fatal("Analytics service not found!")
	}

	ctx.JSON(http.StatusOK, gin.H{
		"ok":      true,
		"message": "Get all analytics service success",
		"data":    &analyticsService,
	})
}

func (ctrl *Controller) getServiceSolution(ctx *gin.Context) {
	service := &models.Service{}
	solutionsService := &[]models.APIService{}

	if err := ctrl.DBConn.Model(service).Where("type = ?", "solution").Find(solutionsService).Error; err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"data":  solutionsService,
		}).Fatal("Solutions service not found!")
	}

	ctx.JSON(http.StatusOK, gin.H{
		"ok":      true,
		"message": "Get all solutions service success",
		"data":    &solutionsService,
	})
}

func (ctrl *Controller) getServiceInnovation(ctx *gin.Context) {
	service := &models.Service{}
	innovationsService := &[]models.APIService{}

	if err := ctrl.DBConn.Model(service).Where("type = ?", "innovation").Find(innovationsService).Error; err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"data":  innovationsService,
		}).Fatal("Innovations service not found!")
	}

	ctx.JSON(http.StatusOK, gin.H{
		"ok":      true,
		"message": "Get all innovations service success",
		"data":    &innovationsService,
	})
}

func (ctrl *Controller) GetServiceBySlug(ctx *gin.Context) {
	service := &models.Service{}
	apiService := &models.APIService{}
	slug := ctx.Param("slug")

	// Log as JSON instead of the default ASCII formatter.
	log.SetFormatter(&log.JSONFormatter{})

	// Output to stdout instead of the default stderr
	// Can be any io.Writer, see below for File example

	// Only log the warning severity or above.
	log.SetLevel(log.WarnLevel)

	if err := ctrl.DBConn.Model(service).First(&apiService, "slug = ?", slug).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			log.WithFields(log.Fields{
				"slug":  slug,
				"error": err,
				"data":  apiService,
			}).Error("Error on finding Slug!")

			ctx.JSON(http.StatusNotFound, gin.H{
				"ok":      false,
				"message": "Service not found",
			})
			return
		}
	}

	message := fmt.Sprintf("Get service by slug=%v success", slug)
	ctx.JSON(http.StatusOK, gin.H{
		"ok":      true,
		"message": message,
		"data":    &apiService,
	})
}

func (ctrl *Controller) CreateServiceRequest(ctx *gin.Context) {
	var inputData models.ServiceRequestInput
	ctx.BindJSON(&inputData)
	sessionId := inputData.SessionID

	// Check if session is not exist in our record
	if !ctrl.IsSessionExist(sessionId) {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"ok":      false,
			"message": "Session ID is not valid",
		})
		return
	}

	// Check if session has expired
	if ctrl.IsSessionExpired(sessionId) {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"ok":      false,
			"message": "Session ID has expired",
		})
		return
	}

	// Convert value of parameter id from string to int
	// and validate if its value is am integer number
	serviceId, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"ok":      false,
			"message": "Expected an integer value from argument 'id'",
		})
		return
	}

	// Get service data from database
	var service models.Service
	if err = ctrl.DBConn.First(&service, serviceId).Error; err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"data":  service,
		}).Error("Error on get service data!")

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	// Set user activity completeness
	visitorActivity := &models.VisitorActivity{SessionID: inputData.SessionID, ServiceID: service.ID, Completeness: 100}
	if err = ctrl.Model.CreateVisitorActivity(visitorActivity); err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"data":  visitorActivity,
		}).Error("Error on Set user activity completeness!")

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	if service.Type == "analytic" {
		RequestToServiceAnalytics(ctx, service, inputData)
		return
	} else if service.Type == "innovation" {
		RequestToServiceInnovation(ctx, service, inputData)
		return
	}

	log.WithFields(log.Fields{
		"error": err,
		"data":  inputData,
	}).Error("Error on Create service request!")

	ctx.JSON(http.StatusInternalServerError, gin.H{
		"ok":      false,
		"message": "Undefined implementation of: " + service.Slug,
	})
	return

}
