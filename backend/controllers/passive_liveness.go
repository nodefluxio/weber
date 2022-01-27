package controllers

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

func (ctrl *Controller) CreatePassiveLivenessRequest(ctx *gin.Context) {
	var inputData models.ServiceRequestInput
	ctx.BindJSON(&inputData)
	sessionId := inputData.SessionID

	log.WithFields(log.Fields{
		"session_id": sessionId,
	}).Info("[CONTROLLER: CreatePassiveLivenessRequest] create passive liveness start...")

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

	var service models.Service
	ctrl.Model.GetServiceBySlug(&service, "passive-liveness")

	serviceData, err := GetResultFaceLiveness(service, inputData.Data)
	if err != nil {
		log.WithFields(log.Fields{
			"error":        err,
			"service_data": serviceData,
		}).Error("[CONTROLLER: CreatePassiveLivenessRequest] error on creating request for Face Liveness Solution!")

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

	log.WithFields(log.Fields{
		"data": serviceData,
	}).Info("[CONTROLLER: CreatePassiveLivenessRequest] request to passive liveness solution successfully done")
}
