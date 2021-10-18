package controllers

import (
	"backend/database"
	"backend/models"
	"backend/utils"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ServiceType string

const (
	Analytic	ServiceType = "analytic"
	Solution				= "solution"
	Innovation				= "innovation"
)

func isValidServiceType(serviceType string) (bool, ServiceType) {
	serviceTypes := [...]ServiceType{Analytic, Solution, Innovation}
	for _, st := range serviceTypes {
		if string(st) == serviceType {
			return true, st
		}
	}

	return false, ""
}

func GetServicesByType(ctx *gin.Context) {
	serviceTypeQuery, isAnyQueryType := ctx.GetQuery("type")

	// check if there is a query URL "type" 
	// and it has an invalid value
	isValid, serviceType := isValidServiceType(serviceTypeQuery)
	if isAnyQueryType && !isValid {
		ctx.JSON(http.StatusBadRequest, gin.H {
			"ok": false,
			"message": "Value of argument '?type=' is not valid",
		})
		return
	}

	switch serviceType {
	case Analytic:
		getServiceAnalytic(ctx)
	case Solution:
		getServiceSolution(ctx)
	case Innovation:
		getServiceInnovation(ctx)
	// handle conditions like /services, /services?types=analytic
	default:
		ctx.JSON(http.StatusBadRequest, gin.H {
			"ok": false,
			"message":  "Expected 1 argument '?type=' with string value or "+ 
						"1 argument '/id' with integer value",
		})
	}
}

func getServiceAnalytic(ctx *gin.Context) {
	db := database.GetDB()

	service := &models.Service{}
	analyticsService := &[]models.APIService{}

	if err := db.Model(service).Where("type = ?", "analytic").Find(analyticsService).Error; err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusOK, gin.H{
		"ok": true,
		"message": "Get all analytics service success",
		"data": &analyticsService,
	})
}

func getServiceSolution(ctx *gin.Context) {
	db := database.GetDB()

	service := &models.Service{}
	solutionsService := &[]models.APIService{}

	if err := db.Model(service).Where("type = ?", "solution").Find(solutionsService).Error; err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusOK, gin.H{
		"ok": true,
		"message": "Get all solutions service success",
		"data": &solutionsService,
	})
}

func getServiceInnovation(ctx *gin.Context) {
	db := database.GetDB()

	service := &models.Service{}
	innovationsService := &[]models.APIService{}

	if err := db.Model(service).Where("type = ?", "innovation").Find(innovationsService).Error; err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusOK, gin.H{
		"ok": true,
		"message": "Get all innovations service success",
		"data": &innovationsService,
	})
}

func GetServiceById(ctx *gin.Context) {
	db := database.GetDB()
	service := &models.Service{}
	apiService := &models.APIService{}
	serviceId, err := strconv.Atoi(ctx.Param("id"))

	if err != nil {
		ctx.JSON(http.StatusBadRequest , gin.H{
			"ok": false,
			"message": "Expected an integer value from argument 'id'",
		})
		return
	}

	if err = db.Model(service).First(&apiService, "id = ?", serviceId).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound , gin.H{
				"ok": false,
				"message": "Service not found",
			})
			return
		}
	}

	message := fmt.Sprintf("Get service by id=%v success", serviceId)
	ctx.JSON(http.StatusOK, gin.H{
		"ok": true,
		"message": message,
		"data": &apiService,
	})
}

func CreateServiceRequest(ctx *gin.Context) {
	var inputData models.ServiceRequestInput
	ctx.BindJSON(&inputData)
	sessionId := inputData.SessionID

	// Check if session is not exist in our record
	if !utils.IsSessionExist(sessionId) {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"ok": false,
			"message": "Session ID is not valid",
		})
		return
	}

	// Check if session has expired
	if utils.IsSessionExpired(sessionId) {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"ok": false,
			"message": "Session ID has expired",
		})
		return
	}

	// Convert value of parameter id from string to int
	// and validate if its value is am integer number
	serviceId, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest , gin.H{
			"ok": false,
			"message": "Expected an integer value from argument 'id'",
		})
		return
	}

	// Insert new record into db
	db := database.GetDB()
	var visitorActivity models.VisitorActivity

	visitorActivity.ServiceID = uint(serviceId)
	visitorActivity.SessionID = sessionId
	visitorActivity.CreatedAt = time.Now()

	if err := models.CreateVisitorActivity(db, &visitorActivity); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok": false,
			"message": err,
		})
		return
	}

	// requestResultString := RequestToService(serviceId, inputData) // Fungsi Request to Cloud

	// Mock json data from requestToService() response
	// Sample Response Body from 
	// https://docs.nodeflux.io/visionaire-cloud/analytics-api/asynchronous/face-recognition
	requestResultString := `
	{
		"job": {
			"id": "b735df462ca567ed6e915c730ec3e44409c9ea546c5199d97b80fb841fe127e9",
			"result": {
				"status": "success",
				"analytic_type": "FACE_RECOGNITION",
				"result": [
					{
						"face_recognition": [
							{
								"candidates": [
									{
										"face_id": "88364589938376705",
										"variation": "17614081020751468384",
										"confidence": 1.0
									}
								]
							}
						]
					}
				]
			}
		},
		"message": "Face Recognition Success",
		"ok": true
	}`

	var serviceData models.ServiceRequestResultData
	err = json.Unmarshal([]byte(requestResultString), &serviceData)
	if err != nil {
        fmt.Println(err)
    }

	ctx.JSON(http.StatusOK, gin.H{
		"ok": true,
		"message": "Service demo request success",
		"service_data": &serviceData,
	})
}