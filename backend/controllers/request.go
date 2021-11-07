package controllers

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func RequestToServiceAnalytics(ctx *gin.Context, service models.Service, inputData models.ServiceRequestInput) {
	var serviceData models.ServiceRequestResultData
	var err error
	dataAnalytic := GetDataAnalytic(service, inputData.Data)
	serviceData, err = RequestToAnalyticSync(dataAnalytic, service.Slug)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"ok":           true,
		"message":      "Service demo request success",
		"service_data": &serviceData,
	})
}
