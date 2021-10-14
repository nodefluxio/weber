package models

import (
	"time"

	"gorm.io/gorm"
)

type VisitorActivity struct {
	ID        	uint 		`gorm:"primaryKey; autoIncrement"`
	// `VisitorActivity` belongs to `Visitor`, `SessionID` is the foreign key
	SessionID 	string
	Visitor		Visitor		`gorm:"foreignKey:SessionID"`
	// `VisitorActivity` belongs to `Service`, `ServiceID` is the foreign key
	ServiceID 	uint
	Service		Service		`gorm:"foreignKey:ServiceID"`
	CreatedAt 	time.Time
}

func CreateVisitorActivity(db *gorm.DB, VisitorActivity *VisitorActivity) (err error) {
	err = db.Create(VisitorActivity).Error
	if err != nil {
		return err
	}
	return nil
}