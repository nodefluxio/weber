package models

import (
	"time"

	"gorm.io/gorm"
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

type RequestData struct {
	AdditionalParams	map[string]interface{}	`json:"additional_params"`
	Images				[]string				`json:"images"`
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
	Message string					`json:"message"`
	Ok 		bool 					`json:"ok"`
}


func CreateService(db *gorm.DB, Service *Service) (err error) {
	err = db.Create(Service).Error
	if err != nil {
		return err
	}
	return nil
}