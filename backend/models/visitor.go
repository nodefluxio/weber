package models

import (
	"time"
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

func (m *Model) CreateVisitor(Visitor *Visitor) (err error) {
	err = m.DBConn.Create(Visitor).Error
	if err != nil {
		return err
	}
	return nil
}

func (m *Model) GetVisitors(Visitor *[]Visitor) (err error) {
	err = m.DBConn.Find(Visitor).Error
	if err != nil {
		return err
	}
	return nil
}

func (m *Model) GetVisitor(Visitor *Visitor, id string) (err error) {
	err = m.DBConn.Where("session_id = ?", id).First(Visitor).Error
	if err != nil {
		return err
	}
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
