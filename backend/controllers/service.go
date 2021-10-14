package controllers

import (
	"backend/database"
	"backend/models"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetServicesByType(ctx *gin.Context) {
	serviceType := ctx.Query("type")

	switch serviceType {
	case "analytic":
		getServiceAnalytic(ctx)
	case "solution":
		getServiceSolution(ctx)
	case "innovation":
		getServiceInnovation(ctx)
	case "":
		ctx.JSON(http.StatusBadRequest, gin.H {
			"ok": false,
			"message":  "Expected 1 argument '?type=' with string value or "+ 
						"1 argument '/id' with integer value",
		})
	default:
		ctx.JSON(http.StatusBadRequest, gin.H {
			"ok": false,
			"message": "Value of argument '?type=' is not recognized",
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