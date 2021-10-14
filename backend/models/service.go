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

type AdditionalParams struct {
	FaceID	string	`json:"face_id"`
}

type RequestData struct {
	Images				[]string			`json:"images"`
	AdditionalParams	AdditionalParams	`json:"additional_params"`
}

type ServiceRequestInput struct {
	SessionID	string			`json:"session_id"`		
	Data		RequestData		`json:"data"`
}

type ServiceRequestResult struct {
	Result 	map[string]interface{} 	`json:"result"`
}

type ServiceRequestResultData struct {
	Job 	ServiceRequestResult	`json:"job"`
	Message string			`json:"message"`
	Ok 		bool 			`json:"ok"`
}