package models

import (
	"time"

	"gorm.io/gorm"
)

type Visitor struct {
	SessionID string    `gorm:"primary_key" json:"session_id"`
	Email     string    `json:"email" validate:"required,email"`
	FullName  string    `json:"full_name" validate:"required,min=2,max=255"`
	Company   string    `json:"company" validate:"required,min=2,max=255"`
	JobTitle  string    `json:"job_title" validate:"required,min=2,max=255"`
	Industry  string    `json:"industry" validate:"required,min=2,max=255"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func CreateVisitor(db *gorm.DB, Visitor *Visitor) (err error) {
	err = db.Create(Visitor).Error
	if err != nil {
		return err
	}
	return nil
}

func GetVisitors(db *gorm.DB, Visitor *[]Visitor) (err error) {
	err = db.Find(Visitor).Error
	if err != nil {
		return err
	}
	return nil
}

func GetVisitor(db *gorm.DB, Visitor *Visitor, id string) (err error) {
	err = db.Where("session_id = ?", id).First(Visitor).Error
	if err != nil {
		return err
	}
	return nil
}

func UpdateVisitor(db *gorm.DB, Visitor *Visitor) (err error) {
	db.Save(Visitor)
	return nil
}

func DeleteVisitor(db *gorm.DB, Visitor *Visitor, id string) (err error) {
	db.Where("session_id = ?", id).Delete(Visitor)
	return nil
}
