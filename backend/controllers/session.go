package controllers

import (
	"backend/models"
	"os"
	"strconv"
	"time"

	log "github.com/sirupsen/logrus"
)

func (ctrl *Controller) IsSessionExist(sessionId string) bool {
	var visitor models.Visitor

	log.WithFields(log.Fields{
		"session_id": sessionId,
	}).Info("[CONTROLLER: IsSessionExist] get visitor session_id start...")

	if err := ctrl.Model.GetVisitor(&visitor, sessionId); err != nil {

		log.WithFields(log.Fields{
			"error":      err,
			"session_id": sessionId,
			"data":       visitor,
		}).Error("[CONTROLLER: IsSessionExist] error, session id not exist!")

		return false
	}

	log.WithFields(log.Fields{
		"session_id": sessionId,
	}).Info("[CONTROLLER: IsSessionExist] get visitor session_id successfully done")

	return true
}

func (ctrl *Controller) IsSessionExpired(sessionId string) bool {
	expirationLimit, err := strconv.Atoi(os.Getenv("SESSION_EXPIRATION"))
	if err != nil {
		log.Fatal("environment variable 'SESSION_EXPIRATION' is not set")
	}

	log.WithFields(log.Fields{
		"session_id": sessionId,
	}).Info("[CONTROLLER: IsSessionExpired] get visitor session_id start...")

	var visitor models.Visitor
	if err := ctrl.Model.GetVisitor(&visitor, sessionId); err != nil {

		log.WithFields(log.Fields{
			"error":      err,
			"session_id": sessionId,
			"data":       visitor,
		}).Error("[CONTROLLER: IsSessionExpired] error, session id expired!")

		return false
	}

	dateExpiration := visitor.CreatedAt.AddDate(0, 0, expirationLimit)
	dateNow := time.Now()

	log.WithFields(log.Fields{
		"session_id": sessionId,
	}).Info("[CONTROLLER: IsSessionExpired] get visitor session_id successfully done")

	return dateNow.After(dateExpiration)
}

func (ctrl *Controller) GetExpirationDate(sessionId string) string {
	expirationLimit, err := strconv.Atoi(os.Getenv("SESSION_EXPIRATION"))
	if err != nil {
		log.Fatal("environment variable 'SESSION_EXPIRATION' is not set")
	}

	var visitor models.Visitor
	ctrl.Model.GetVisitor(&visitor, sessionId)
	dateExpiration := visitor.CreatedAt.AddDate(0, 0, expirationLimit)

	return dateExpiration.Format("02-01-2006 15:04:05")
}
