package models

import (
	"time"

	"gorm.io/gorm"
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

func CreateVisitorActivity(db *gorm.DB, VisitorActivity *VisitorActivity) (err error) {
	err = db.Create(VisitorActivity).Error
	if err != nil {
		return err
	}
	return nil
}
