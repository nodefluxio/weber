package models

import (
	"time"
)

type Service struct {
	ID               uint 		`gorm:"primaryKey; autoIncrement" json:"id"` 
	ApiKey           string 	`json:"api_key"`
	Type             string 	`json:"type"`
	Slug             string 	`json:"slug"`
	Name             string 	`json:"name"`
	ShortDescription string 	`json:"short_description"`
	LongDescription  string 	`json:"long_description"`
	Thumbnail        string 	`json:"thumbnail"`
	CreatedAt        time.Time	`json:"created_at"`
	UpdatedAt        time.Time	`json:"updated_at"`
}

type APIService struct {
	ID               uint 		`json:"id"` 
	Type             string 	`json:"type"`
	Slug             string 	`json:"slug"`
	Name             string 	`json:"name"`
	ShortDescription string 	`json:"short_description"`
	LongDescription  string 	`json:"long_description"`
	Thumbnail        string 	`json:"thumbnail"`
	CreatedAt        time.Time	`json:"created_at"`
	UpdatedAt        time.Time	`json:"updated_at"`
}