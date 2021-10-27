package controllers

import (
	"backend/database"
	"backend/models"
	"backend/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateFeedback(ctx *gin.Context) {

	serviceId, _ := strconv.Atoi(ctx.Param("service_id"))
	var feedbackInput models.FeedbackInput
	ctx.BindJSON(&feedbackInput)

	// Check if session is not exist in our record
	if !utils.IsSessionExist(feedbackInput.SessionID) {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"ok":      false,
			"message": "Session ID is not valid",
		})
		return
	}

	// Check if session has expired
	if utils.IsSessionExpired(feedbackInput.SessionID) {
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

	db := database.GetDB()

	var lastActivity models.VisitorActivity
	if err := models.GetCurrentVisitorActivity(db, &lastActivity, feedbackInput.SessionID, serviceId); err != nil {
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

	if err := models.CreateFeedbackDb(db, &feedback); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Feedback submited!", "ok": true})
}
