package models

import (
	"time"
)

type VisitorActivity struct {
	ID        string `gorm:"primary_key"`
	CookieID  string
	ServiceID int
	CreatedAt time.Time
	UpdatedAt time.Time
}
