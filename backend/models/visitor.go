package models

import (
	"backend/database"
	"time"
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

func CreateVisitor(Visitor *Visitor) (err error) {
	err = database.DB.Create(Visitor).Error
	if err != nil {
		return err
	}
	return nil
}

func GetVisitors(Visitor *[]Visitor) (err error) {
	err = database.DB.Find(Visitor).Error
	if err != nil {
		return err
	}
	return nil
}

func GetVisitor(Visitor *Visitor, id string) (err error) {
	err = database.DB.Where("cookie_id = ?", id).First(Visitor).Error
	if err != nil {
		return err
	}
	return nil
}

func UpdateVisitor(Visitor *Visitor) (err error) {
	database.DB.Save(Visitor)
	return nil
}

func DeleteVisitor(Visitor *Visitor, id string) (err error) {
	database.DB.Where("cookie_id = ?", id).Delete(Visitor)
	return nil
}
