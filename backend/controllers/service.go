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
	log.Info("[CONTROLLER: GetServices] get services start...")

	isValid, serviceType := ctrl.Model.IsValidServiceType(serviceTypeQuery)
	if isAnyQueryType && !isValid {
		log.WithFields(log.Fields{
			"data": serviceTypeQuery,
		}).Error("[CONTROLLER: GetServices] error on query type not valid")

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

	log.WithFields(log.Fields{
		"data": serviceType,
	}).Info("[CONTROLLER: GetServices] get service successfully done!")

}

func (ctrl *Controller) getAllServices(ctx *gin.Context) {
	service := &models.Service{}
	analyticsService := &[]models.APIService{}

	log.Info("[CONTROLLER: getAllServices] get all services start...")

	if err := ctrl.DBConn.Model(service).Find(analyticsService).Error; err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"data":  analyticsService,
		}).Error("[CONTROLLER: getAllServices] error on get all services")
	}

	ctx.JSON(http.StatusOK, gin.H{
		"ok":      true,
		"message": "Get all services success",
		"data":    &analyticsService,
	})

	log.WithFields(log.Fields{
		"data": analyticsService,
	}).Info("[CONTROLLER: getAllServices] get all services successfully done")

}

func (ctrl *Controller) getServiceAnalytic(ctx *gin.Context) {
	service := &models.Service{}
	analyticsService := &[]models.APIService{}

	log.Info("[CONTROLLER: getServiceAnalytic] get analytic service start...")

	if err := ctrl.DBConn.Model(service).Where("type = ?", "analytic").Find(analyticsService).Error; err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"data":  analyticsService,
		}).Error("[CONTROLLER: getServiceAnalytic] analytics service not found!")
	}

	log.WithFields(log.Fields{
		"data": analyticsService,
	}).Info("[CONTROLLER: getServiceAnalytic] get analytic service successfully done")

	ctx.JSON(http.StatusOK, gin.H{
		"ok":      true,
		"message": "Get all analytics service success",
		"data":    &analyticsService,
	})
}

func (ctrl *Controller) getServiceSolution(ctx *gin.Context) {
	service := &models.Service{}
	solutionsService := &[]models.APIService{}

	log.Info("[CONTROLLER: getServiceSolution] get solution service start...")

	if err := ctrl.DBConn.Model(service).Where("type = ?", "solution").Find(solutionsService).Error; err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"data":  solutionsService,
		}).Error("[CONTROLLER: getServiceSolution] solutions service not found!")
	}

	log.WithFields(log.Fields{
		"data": solutionsService,
	}).Info("[CONTROLLER: getServiceSolution] get solution service successfully done")

	ctx.JSON(http.StatusOK, gin.H{
		"ok":      true,
		"message": "Get all solutions service success",
		"data":    &solutionsService,
	})
}

func (ctrl *Controller) getServiceInnovation(ctx *gin.Context) {
	service := &models.Service{}
	innovationsService := &[]models.APIService{}

	log.Info("[CONTROLLER: getServiceInnovation] get innovation service start...")

	if err := ctrl.DBConn.Model(service).Where("type = ?", "innovation").Find(innovationsService).Error; err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"data":  innovationsService,
		}).Error("[CONTROLLER: getServiceInnovation] innovations service not found!")
	}

	log.WithFields(log.Fields{
		"data": innovationsService,
	}).Info("[CONTROLLER: getServiceInnovation] get innovation service successfully done")

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

	log.WithFields(log.Fields{
		"slug": slug,
	}).Info("[CONTROLLER: GetServiceBySlug] get service by slug start...")

	if err := ctrl.DBConn.Model(service).First(&apiService, "slug = ?", slug).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			log.WithFields(log.Fields{
				"slug":  slug,
				"error": err,
				"data":  apiService,
			}).Error("[CONTROLLER: GetServiceBySlug] error on finding Slug!")

			ctx.JSON(http.StatusNotFound, gin.H{
				"ok":      false,
				"message": "Service not found",
			})
			return
		}
	}

	log.WithFields(log.Fields{
		"slug": slug,
		"data": apiService,
	}).Info("[CONTROLLER: GetServiceBySlug] get service by slug successfully done")

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

	log.WithFields(log.Fields{
		"session_id": sessionId,
	}).Info("[CONTROLLER: CreateServiceRequest] create service request start...")

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
			"error":      err,
			"data":       service,
			"service_id": serviceId,
		}).Error("[CONTROLLER: CreateServiceRequest] error on get service data!")

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
		}).Error("[CONTROLLER: CreateServiceRequest] error on set user activity completeness!")

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
		"error":      err,
		"input_data": inputData,
		"service":    service,
	}).Error("[CONTROLLER: CreateServiceRequest] error on create service request!")

	ctx.JSON(http.StatusInternalServerError, gin.H{
		"ok":      false,
		"message": "Undefined implementation of: " + service.Slug,
	})
	return

}
