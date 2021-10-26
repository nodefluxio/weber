package controllers

import (
	"backend/database"
	"backend/models"
	"backend/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type feedbackInput struct {
	SessionID string `json:"session_id"`
	Rating    uint   `json:"rating" validate:"required,min=1,max=5"`
	Comment   string `json:"comment" validate:"max=255"`
}

func CreateFeedback(ctx *gin.Context) {

	serviceId, _ := strconv.Atoi(ctx.Param("id"))
	var feedbackInput feedbackInput
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
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Your Feedback is Required!!", "ok": false})
			return
		}
	}

	if err := utils.Validate.Struct(feedbackInput); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	db := database.GetDB()

	var lastActivity models.VisitorActivity
	if err := models.GetLastActivity(db, &lastActivity, feedbackInput.SessionID, serviceId); err != nil {
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
