package controllers

import (
	"backend/models"
	"log"
	"os"
	"strconv"
	"time"
)

func (ctrl *Controller) IsSessionExist(sessionId string) bool {
	var visitor models.Visitor

	if err := models.GetVisitor(ctrl.dbConn, &visitor, sessionId); err != nil {
		return false
	}

	return true
}

func (ctrl *Controller) IsSessionExpired(sessionId string) bool {
	expirationLimit, err := strconv.Atoi(os.Getenv("SESSION_EXPIRATION"))
	if err != nil {
		log.Fatal("environment variable 'SESSION_EXPIRATION' is not set")
	}

	var visitor models.Visitor
	if err := models.GetVisitor(ctrl.dbConn, &visitor, sessionId); err != nil {
		return false
	}

	dateExpiration := visitor.CreatedAt.AddDate(0, 0, expirationLimit)
	dateNow := time.Now()

	return dateNow.After(dateExpiration)
}
