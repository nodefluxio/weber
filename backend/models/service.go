package models

import (
	"time"

	log "github.com/sirupsen/logrus"
)

type ServiceType string

const (
	AnalyticServiceType        ServiceType = "analytic"
	SolutionServiceType                    = "solution"
	InnovationServiceType                  = "innovation"
	SolutionPartnerServiceType             = "solution-partner"
)

type Service struct {
	ID                 uint `gorm:"primaryKey; autoIncrement" json:"id"`
	Name               string
	Type               string
	Slug               string
	Thumbnail          string
	AccessKey          string
	Token              string
	Timestamp          string
	ShortDescription   string
	LongDescription    string
	SpecialInstruction string
	CreatedAt          time.Time
	UpdatedAt          time.Time
}

type APIService struct {
	ID                 uint      `json:"id"`
	Type               string    `json:"type"`
	Slug               string    `json:"slug"`
	Name               string    `json:"name"`
	ShortDescription   string    `json:"short_description"`
	LongDescription    string    `json:"long_description"`
	SpecialInstruction string    `json:"special_instruction"`
	Thumbnail          string    `json:"thumbnail"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

type RequestData struct {
	AdditionalParams map[string]interface{} `json:"additional_params"`
	Images           []string               `json:"images"`
}

type ServiceRequestInput struct {
	SessionID string      `json:"session_id"`
	Data      RequestData `json:"data"`
}

type ServiceRequestResult struct {
	ID     string                 `json:"id"`
	Result map[string]interface{} `json:"result"`
}

type ServiceRequestResultData struct {
	Job     ServiceRequestResult `json:"job"`
	Message string               `json:"message"`
	Ok      bool                 `json:"ok"`
}

type BoundingBox struct {
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

func (m *Model) CreateService(Service *Service) (err error) {

	log.WithFields(log.Fields{
		"service": Service,
	}).Info("[MODEL: CreateService] create service start...")

	err = m.DBConn.Create(Service).Error
	if err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"data":  Service,
		}).Error("[MODEL: CreateService] error on create service!")

		return err
	}
	log.WithFields(log.Fields{
		"data": Service,
	}).Info("[MODEL: CreateService] success on create service!")
	return nil
}

func (m *Model) IsValidServiceType(serviceType string) (bool, ServiceType) {
	serviceTypes := [...]ServiceType{AnalyticServiceType, SolutionServiceType, InnovationServiceType, SolutionPartnerServiceType}
	for _, st := range serviceTypes {
		if string(st) == serviceType {
			return true, st
		}
	}

	return false, ""
}

func (m *Model) GetServiceBySlug(Service *Service, slug string) (err error) {

	log.WithFields(log.Fields{
		"service": Service,
		"slug":    slug,
	}).Info("[MODEL: GetServiceBySlug] get service by slug start...")

	err = m.DBConn.Where("slug = ?", slug).First(Service).Error
	if err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"slug":  slug,
		}).Error("[MODEL: GetServiceBySlug] error on find service slug!")

		return err
	}
	log.WithFields(log.Fields{
		"slug": slug,
	}).Info("[MODEL: GetServiceBySlug] success on find service slug!")

	return nil
}

func (m *Model) GetServiceById(Service *Service, id uint) (err error) {

	log.WithFields(log.Fields{
		"service": Service,
		"id":      id,
	}).Info("[MODEL: GetServiceById] get service by id start...")

	err = m.DBConn.Where("id = ?", id).First(Service).Error
	if err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"id":    id,
		}).Error("[MODEL: GetServiceById] error on find service by id!")

		return err
	}
	log.WithFields(log.Fields{
		"id": id,
	}).Info("[MODEL: GetServiceById] success on find service by id!")

	return nil
}
