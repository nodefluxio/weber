package controllers

import (
	"backend/models"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func (ctrl *Controller) GetServices(ctx *gin.Context) {
	serviceTypeQuery, isAnyQueryType := ctx.GetQuery("type")

	// check if there is a query URL "type"
	// and it has an invalid value
	isValid, serviceType := models.IsValidServiceType(serviceTypeQuery)
	if isAnyQueryType && !isValid {
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

	if err := ctrl.dbConn.Model(service).Find(analyticsService).Error; err != nil {
		log.Fatal(err)
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

	if err := ctrl.dbConn.Model(service).Where("type = ?", "analytic").Find(analyticsService).Error; err != nil {
		log.Fatal(err)
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

	if err := ctrl.dbConn.Model(service).Where("type = ?", "solution").Find(solutionsService).Error; err != nil {
		log.Fatal(err)
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

	if err := ctrl.dbConn.Model(service).Where("type = ?", "innovation").Find(innovationsService).Error; err != nil {
		log.Fatal(err)
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

	if err := ctrl.dbConn.Model(service).First(&apiService, "slug = ?", slug).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
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
	if err = ctrl.dbConn.First(&service, serviceId).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	if service.Type == "analytic" {
		visitorActivity := &models.VisitorActivity{SessionID: inputData.SessionID, ServiceID: service.ID, Completeness: 100}
		if err = models.CreateVisitorActivity(ctrl.dbConn, visitorActivity); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"ok":      false,
				"message": err.Error(),
			})
			return
		}
		RequestToServiceAnalytics(ctx, service, inputData)
		return
	}

	ctx.JSON(http.StatusInternalServerError, gin.H{
		"ok":      false,
		"message": "Undefined implementation of: " + service.Slug,
	})
	return

}
