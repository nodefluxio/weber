package models

import (
	"time"
)

type Service struct {
	ID               string `gorm:"primary_key"`
	Type             string
	Slug             string
	Name             string
	ShortDescription string
	LongDescription  string
	Thumbnail        string
	CreatedAt        time.Time
	UpdatedAt        time.Time
}
