package controllers

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

func (ctrl *Controller) CreateActivity(ctx *gin.Context) {
	var visitorActivity models.VisitorActivity
	ctx.BindJSON(&visitorActivity)

	log.WithFields(log.Fields{
		"session_id":   visitorActivity.SessionID,
		"service_id":   visitorActivity.ServiceID,
		"completeness": visitorActivity.Completeness,
	}).Info("[CONTROLLER: CreateActivity] create activity start...")

	var service models.Service
	if err := ctrl.Model.GetServiceById(&service, visitorActivity.ServiceID); err != nil {
		log.WithFields(log.Fields{
			"error":      err,
			"service_id": visitorActivity.ServiceID,
		}).Error("[CONTROLLER: CreateActivity] error when trying to get service by id!")

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	// If the service is from the partner, we need to use a predefined visitor.
	// But for "AML / PEP (Sijitu)" we still need the real identity of the visitor.
	if service.Type == "solution-partner" && service.Slug != "aml-pep" {
		if visitorActivity.SessionID == "" {
			visitorActivity.SessionID = "SessionForSolutionPartner"
		}
	} else {
		// Check if session is not exist in our record
		if !ctrl.IsSessionExist(visitorActivity.SessionID) {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"ok":      false,
				"message": "Session ID is not valid",
			})
			return
		}

		// Check if session has expired
		if ctrl.IsSessionExpired(visitorActivity.SessionID) {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"ok":      false,
				"message": "Session ID has expired",
			})
			return
		}
	}

	// Insert new record into db
	if err := ctrl.Model.CreateVisitorActivity(&visitorActivity); err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"data":  visitorActivity,
		}).Error("[CONTROLLER: CreateVisitorActivity] error on create visitor activity!")

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	log.WithFields(log.Fields{
		"data": visitorActivity,
	}).Info("[CONTROLLER: CreateActivity] success on create activity!")

	ctx.JSON(http.StatusOK, gin.H{"message": "Data has been processed successfully", "ok": true})
}
