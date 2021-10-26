package controllers

import (
	"backend/database"
	"backend/models"
	"backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateActivity(ctx *gin.Context) {
	var visitorActivity models.VisitorActivity
	ctx.BindJSON(&visitorActivity)

	// Check if session is not exist in our record
	if !utils.IsSessionExist(visitorActivity.SessionID) {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"ok":      false,
			"message": "Session ID is not valid",
		})
		return
	}

	// Check if session has expired
	if utils.IsSessionExpired(visitorActivity.SessionID) {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"ok":      false,
			"message": "Session ID has expired",
		})
		return
	}

	// Insert new record into db
	db := database.GetDB()
	if err := models.CreateVisitorActivity(db, &visitorActivity); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Data has been processed successfully", "ok": true})
}
