package models

import (
	"time"

	log "github.com/sirupsen/logrus"
)

type Visitor struct {
	SessionID string    `gorm:"primary_key" json:"session_id"`
	Email     string    `json:"email" validate:"required,email"`
	FullName  string    `json:"full_name" validate:"required,min=5,max=255"`
	Company   string    `json:"company" validate:"required,min=5,max=255"`
	JobTitle  string    `json:"job_title" validate:"required,min=5,max=255"`
	Industry  string    `json:"industry" validate:"required,min=2,max=255"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (m *Model) CreateVisitor(Visitor *Visitor) (err error) {

	log.WithFields(log.Fields{
		"data": Visitor,
	}).Info("[MODEL: CreateVisitor] create visitor start...")

	err = m.DBConn.Create(Visitor).Error
	if err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"data":  Visitor,
		}).Error("[MODEL: CreateVisitor] error on create visitor!")

		return err
	}
	log.WithFields(log.Fields{
		"data": Visitor,
	}).Info("[MODEL: CreateVisitor] success on create visitor!")

	return nil
}

func (m *Model) GetVisitors(Visitor *[]Visitor) (err error) {

	log.WithFields(log.Fields{
		"data": Visitor,
	}).Info("[MODEL: GetVisitors] get visitors start...")

	err = m.DBConn.Find(Visitor).Error
	if err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"data":  Visitor,
		}).Error("[MODEL: GetVisitors] error on get visitors!")

		return err
	}
	log.WithFields(log.Fields{
		"data": Visitor,
	}).Info("[MODEL: GetVisitors] success on get visitors!")

	return nil
}

func (m *Model) GetVisitor(Visitor *Visitor, id string) (err error) {

	log.WithFields(log.Fields{
		"data": Visitor,
		"id":   id,
	}).Info("[MODEL: GetVisitor] get visitor start...")

	err = m.DBConn.Where("session_id = ?", id).First(Visitor).Error
	if err != nil {
		log.WithFields(log.Fields{
			"session_id": id,
			"error":      err,
		}).Error("[MODEL: GetVisitor] error get visitor based on session_id!")

		return err
	}
	log.WithFields(log.Fields{
		"data": Visitor,
	}).Info("[MODEL: GetVisitor] success on get visitor")
	return nil
}

func (m *Model) UpdateVisitor(Visitor *Visitor) (err error) {
	m.DBConn.Save(Visitor)
	return nil
}

func (m *Model) DeleteVisitor(Visitor *Visitor, id string) (err error) {
	m.DBConn.Where("session_id = ?", id).Delete(Visitor)
	return nil
}
