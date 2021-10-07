package controllers

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Service models.Service
type Services []models.Service

func CheckServiceType(serviceType string, ctx *gin.Context) {
	switch serviceType {
	case "analytic":
		getServiceAnalytic()
	case "solution":
		getServiceSolution()
	case "innovation":
		getServiceInnovation()
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

func getServiceAnalytic() {}
func getServiceSolution() {}
func getServiceInnovation() {}