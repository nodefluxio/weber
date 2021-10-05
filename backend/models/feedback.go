package models

import (
	"time"
)

type Feedback struct {
	ID                string `gorm:"primary_key"`
	VisitorActivityID string
	Text              string
	Emoji             string
	CreatedAt         time.Time
	UpdatedAt         time.Time
}
