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

	// Insert new record into db
	if err := ctrl.Model.CreateVisitorActivity(&visitorActivity); err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"data":  visitorActivity,
		}).Error("Error on create visitor activity!")

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Data has been processed successfully", "ok": true})
}
