package controllers

import (
	"backend/database"
	"backend/models"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CheckServiceType(serviceType string, ctx *gin.Context) {
	switch serviceType {
	case "analytic":
		getServiceAnalytic(ctx)
	case "solution":
		getServiceSolution(ctx)
	case "innovation":
		getServiceInnovation(ctx)
	case "":
		serviceTypeIsNull(ctx)
	default:
		serviceTypeIsNotRecognized(ctx)
	}
}

func serviceTypeIsNull(ctx *gin.Context) {
	ctx.JSON(http.StatusBadRequest,
		gin.H {
			"ok": false,
			"message": "Expected 1 argument 'type'",
		},
	)
}

func serviceTypeIsNotRecognized(ctx *gin.Context) {
	ctx.JSON(http.StatusBadRequest,
		gin.H {
			"ok": false,
			"message": "Value of argument 'type' is not recognized",
		},
	)
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