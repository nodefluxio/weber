package models

import (
	"time"

	log "github.com/sirupsen/logrus"
)

type VisitorActivity struct {
	ID           uint    `gorm:"primaryKey; autoIncrement"`
	SessionID    string  `json:"session_id"`
	Visitor      Visitor `gorm:"foreignKey:SessionID"` // `VisitorActivity` belongs to `Visitor`, `SessionID` is the foreign key
	ServiceID    uint    `json:"service_id"`
	Service      Service `gorm:"foreignKey:ServiceID"` // `VisitorActivity` belongs to `Service`, `ServiceID` is the foreign key
	Completeness int     `json:"completeness"`
	CreatedAt    time.Time
}

func (m *Model) CreateVisitorActivity(VisitorActivity *VisitorActivity) (err error) {

	log.WithFields(log.Fields{
		"data": VisitorActivity,
	}).Info("[MODEL] create visitor activity start...")

	err = m.DBConn.Create(VisitorActivity).Error
	if err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"data":  VisitorActivity,
		}).Error("[MODEL] error on create visitor activity!")

		return err
	}
	log.WithFields(log.Fields{
		"data": VisitorActivity,
	}).Info("[MODEL] success on create visitor activity!")

	return nil
}

func (m *Model) GetCurrentVisitorActivity(VisitorActivity *VisitorActivity, session_id string, service_id int) (err error) {

	log.WithFields(log.Fields{
		"data": VisitorActivity,
	}).Info("[MODEL] get last visitor activity start...")

	err = m.DBConn.Where("session_id = ? AND service_id = ?", session_id, service_id).Last(VisitorActivity).Error
	if err != nil {
		log.WithFields(log.Fields{
			"session_id": session_id,
			"service_id": service_id,
			"error":      err,
		}).Error("[MODEL] error get last visitor activity based on session_id and service_id!")

		return err
	}
	log.WithFields(log.Fields{
		"data":       VisitorActivity,
		"session_id": session_id,
		"service_id": service_id,
	}).Info("[MODEL] success on get last visitor activity")

	return nil
}
