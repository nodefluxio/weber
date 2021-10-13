package controllers

import (
	"backend/database"
	"backend/models"
	"backend/utils"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func CreateVisitor(ctx *gin.Context) {
	db := database.GetDB()
	emailBlacklist := [1]string{"@yopmail.com"}
	var visitor models.Visitor
	ctx.BindJSON(&visitor)

	// Validate the inputs
	err := utils.Validate.Struct(visitor)
	errs := utils.TranslateError(err)
	if len(errs) > 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": errs[0].Error(), "ok": false})
		return
	}
	for i := 0; i < len(emailBlacklist); i++ {
		if strings.Contains(visitor.Email, emailBlacklist[i]) {
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "email is invalid", "ok": false})
			return
		}
	}

	// Generate necessary data
	sessionId := uuid.New()
	visitor.SessionID = sessionId.String()
	visitor.CreatedAt = time.Now()
	visitor.UpdatedAt = time.Now()

	err = models.CreateVisitor(db, &visitor)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": err, "ok": false})
		return
	}
	var slice []map[string]string
	data := map[string]string{
		"session_id": sessionId.String(),
	}
	slice = append(slice, data)

	ctx.JSON(http.StatusOK, gin.H{"data": slice, "message": "Data has been processed successfully", "ok": true})
}