package controllers

import (
	"backend/models"
	"backend/utils"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	log "github.com/sirupsen/logrus"
)

func (ctrl *Controller) CreateVisitor(ctx *gin.Context) {
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
	expirationLimit := os.Getenv("SESSION_EXPIRATION")
	expirationLimitInt, err := strconv.Atoi(expirationLimit)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	expirationLimitSecond := expirationLimitInt * 24 * 60 * 60

	log.WithFields(log.Fields{
		"data": visitor,
	}).Info("[CONTROLLER: CreateVisitor] create visitor start...")

	err = ctrl.Model.CreateVisitor(&visitor)
	if err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"data":  visitor,
		}).Error("[CONTROLLER: CreateVisitor] error on create visitor!")

		ctx.JSON(http.StatusInternalServerError, gin.H{"message": err, "ok": false})
		return
	}
	var slice []map[string]interface{}
	data := map[string]interface{}{
		"session_id": sessionId.String(),
		"max_age":    expirationLimitSecond,
	}
	slice = append(slice, data)

	log.WithFields(log.Fields{
		"data": visitor,
	}).Info("[CONTROLLER: CreateVisitor] create visitor successfully done!")

	ctx.JSON(http.StatusOK, gin.H{"data": slice, "message": "Data has been processed successfully", "ok": true})
}
