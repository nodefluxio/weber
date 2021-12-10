package controllers

import (
	"backend/models"
	"backend/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

func (ctrl *Controller) CreateFeedback(ctx *gin.Context) {
	serviceId, _ := strconv.Atoi(ctx.Param("service_id"))
	var feedbackInput models.FeedbackInput
	ctx.BindJSON(&feedbackInput)

	log.WithFields(log.Fields{
		"service_id": serviceId,
	}).Info("[CONTROLLER: CreateFeedback] create feedback start...")

	// Check if session is not exist in our record
	if !ctrl.IsSessionExist(feedbackInput.SessionID) {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"ok":      false,
			"message": "Session ID is not valid",
		})
		return
	}

	// Check if session has expired
	if ctrl.IsSessionExpired(feedbackInput.SessionID) {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"ok":      false,
			"message": "Session ID has expired",
		})
		return
	}

	//validate Input
	if feedbackInput.Rating < 4 {
		if feedbackInput.Comment == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Your comment for this feedback is required", "ok": false})
			return
		}
	}

	err := utils.Validate.Struct(feedbackInput)
	errs := utils.TranslateError(err)
	if len(errs) > 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": errs[0].Error(), "ok": false})
		return
	}

	var lastActivity models.VisitorActivity
	if err := ctrl.Model.GetCurrentVisitorActivity(&lastActivity, feedbackInput.SessionID, serviceId); err != nil {
		log.WithFields(log.Fields{
			"error":             err,
			"session_id":        feedbackInput.SessionID,
			"service_id":        serviceId,
			"data_lastActivity": lastActivity,
		}).Error("[CONTROLLER: GetCurrentVisitorActivity] error on get current visitor activity!")

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	var feedback models.Feedback
	feedback.VisitorActivityID = lastActivity.ID
	feedback.Comment = feedbackInput.Comment
	feedback.Rating = feedbackInput.Rating

	if err := ctrl.Model.CreateFeedbackDb(&feedback); err != nil {
		log.WithFields(log.Fields{
			"service_id":    serviceId,
			"error":         err,
			"data_feedback": feedback,
		}).Error("[CONTROLLER: CreateFeedbackDb] error on create feedback!")

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	log.WithFields(log.Fields{
		"data": feedback,
	}).Info("[CONTROLLER: CreateFeedback] create feedback successfully done")

	ctx.JSON(http.StatusOK, gin.H{"message": "Feedback submitted!", "ok": true})
}
