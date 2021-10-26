package models

import (
	"time"

	"gorm.io/gorm"
)

type Feedback struct {
	ID                uint `gorm:"primary_key"`
	VisitorActivityID uint
	VisitorActivity   VisitorActivity `gorm:"foreignKey:VisitorActivityID"`
	Rating            uint            `json:"rating" validate:"required,min=1,max=5"`
	Comment           string          `json:"comment" validate:"required,min=20,max=255"`
	CreatedAt         time.Time
}

func CreateFeedbackDb(db *gorm.DB, Feedback *Feedback) (err error) {
	err = db.Create(Feedback).Error
	if err != nil {
		return err
	}
	return nil
}
