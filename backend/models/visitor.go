package models

import (
	"time"

	"gorm.io/gorm"
)

type Visitor struct {
	CookieID    string `gorm:"primary_key"`
	Email       string
	FullName    string
	CompanyName string
	JobTitle    string
	CreatedAt   time.Time
	UpdatedAt   time.Time
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
	err = db.Where("cookie_id = ?", id).First(Visitor).Error
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
	db.Where("cookie_id = ?", id).Delete(Visitor)
	return nil
}
