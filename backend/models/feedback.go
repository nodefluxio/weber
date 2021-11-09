package models

import (
	"time"
)

type Feedback struct {
	ID                uint `gorm:"primary_key"`
	VisitorActivityID uint
	VisitorActivity   VisitorActivity `gorm:"foreignKey:VisitorActivityID"`
	Rating            uint            `json:"rating" validate:"required,min=1,max=5"`
	Comment           string          `json:"comment" validate:"required,min=20,max=255"`
	CreatedAt         time.Time
}

type FeedbackInput struct {
	SessionID string `json:"session_id"`
	Rating    uint   `json:"rating" validate:"required,min=1,max=5"`
	Comment   string `json:"comment" validate:"max=255"`
}

func (m *Model) CreateFeedbackDb(Feedback *Feedback) (err error) {
	err = m.DBConn.Create(Feedback).Error
	if err != nil {
		return err
	}
	return nil
}
