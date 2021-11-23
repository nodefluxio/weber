package database

import (
	"backend/models"
	"os"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func seedVisitor(model *models.Model) []string {
	var visitors = []models.Visitor{
		{
			SessionID: "",
			Email:     "natasha@nodeflux.io",
			FullName:  "Natasha Romanoff",
			Company:   "The Black Widow Ops Program",
			JobTitle:  "Product Manager",
			Industry:  "Computer Vision",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			SessionID: "",
			Email:     "bucky@nodeflux.io",
			FullName:  "Bucky Barnes",
			Company:   "The Winter Soldier Corp",
			JobTitle:  "Software Engineer",
			Industry:  "Computer Vision",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		// Add new visitor here
	}

	sessionIds := []string{}

	for _, visitor := range visitors {
		sessionId := uuid.New()
		sessionIds = append(sessionIds, sessionId.String())
		visitor.SessionID = sessionId.String()
		model.CreateVisitor(&visitor)
	}

	return sessionIds
}

func seedVisitorActivity(model *models.Model, sessionIds []string) {
	for _, sessionId := range sessionIds {
		var visitorActivity = &models.VisitorActivity{
			SessionID:    sessionId,
			ServiceID:    1,
			Completeness: 100,
		}
		model.CreateVisitorActivity(visitorActivity)
	}
}

func seedService(model *models.Model) {
	// all tokens and access keys provided here are just a random example
	var services = []models.Service{
		{
			Name:               "Optical Character Recognition KTP",
			Type:               "analytic",
			Slug:               "ocr-ktp",
			Thumbnail:          "ocr-ktp.png",
			AccessKey:          os.Getenv("ACCESS_KEY_OCR"),
			Token:              os.Getenv("TOKEN_OCR"),
			Timestamp:          os.Getenv("TIMESTAMP_OCR"),
			ShortDescription:   "OCR KTP Description",
			LongDescription:    "OCR KTP Looonng Descriptiooonnn",
			SpecialInstruction: "Special Instruction for OCR KTP",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "License Plate Recognition",
			Type:               "analytic",
			Slug:               "license-plate-recognition",
			Thumbnail:          "license-plate-recognition.png",
			AccessKey:          os.Getenv("ACCESS_KEY_LPR"),
			Token:              os.Getenv("TOKEN_LPR"),
			Timestamp:          os.Getenv("TIMESTAMP_LPR"),
			ShortDescription:   "LPR Description",
			LongDescription:    "LPR Looonng Descriptiooonnn",
			SpecialInstruction: "Special Instruction for LPR",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "People Density",
			Type:               "analytic",
			Slug:               "people-density",
			Thumbnail:          "people-density.png",
			AccessKey:          os.Getenv("ACCESS_KEY_PD"),
			Token:              os.Getenv("TOKEN_PD"),
			Timestamp:          os.Getenv("TIMESTAMP_PD"),
			ShortDescription:   "People Density Description",
			LongDescription:    "People Density Looonng Descriptiooonnn",
			SpecialInstruction: "Special Instruction for People Density",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "Face Match with Enrollment",
			Type:               "analytic",
			Slug:               "face-match-enrollment",
			Thumbnail:          "face-match-enrollment.png",
			AccessKey:          os.Getenv("ACCESS_KEY_FME"),
			Token:              os.Getenv("TOKEN_FME"),
			Timestamp:          os.Getenv("TIMESTAMP_FME"),
			ShortDescription:   "Face Match with Enrollment Description",
			LongDescription:    "Face Match with Enrollment Looonng Descriptiooonnn",
			SpecialInstruction: "Special Instruction for Face Match with Enrollment",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "Face Mask Detection",
			Type:               "analytic",
			Slug:               "face-mask",
			Thumbnail:          "face-mask.png",
			AccessKey:          os.Getenv("ACCESS_KEY_FMD"),
			Token:              os.Getenv("TOKEN_FMD"),
			Timestamp:          os.Getenv("TIMESTAMP_FMD"),
			ShortDescription:   "Face Mask Detection Description",
			LongDescription:    "Face Mask Detection Looonng Descriptiooonnn",
			SpecialInstruction: "Special Instruction for Face Mask Detection",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "Face Demography",
			Type:               "analytic",
			Slug:               "face-demography",
			Thumbnail:          "face-demography.png",
			AccessKey:          os.Getenv("ACCESS_KEY_FD"),
			Token:              os.Getenv("TOKEN_FD"),
			Timestamp:          os.Getenv("TIMESTAMP_FD"),
			ShortDescription:   "Face Demography Description",
			LongDescription:    "Face Demography Looonng Descriptiooonnn",
			SpecialInstruction: "Special Instruction for Face Demography",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "Electronic Know Your Customer",
			Type:               "solution",
			Slug:               "ekyc",
			Thumbnail:          "ekyc.png",
			AccessKey:          os.Getenv("ACCESS_KEY_EKYC"),
			Token:              os.Getenv("TOKEN_EKYC"),
			Timestamp:          os.Getenv("TIMESTAMP_EKYC"),
			ShortDescription:   "Electronic Know Your Customer Description",
			LongDescription:    "Electronic Know Your Customer Looonng Descriptiooonnn",
			SpecialInstruction: "Special Instruction for EKYC",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "Face Payment",
			Type:               "solution",
			Slug:               "face-payment",
			Thumbnail:          "face-payment.png",
			AccessKey:          os.Getenv("ACCESS_KEY_FP"),
			Token:              os.Getenv("TOKEN_FP"),
			Timestamp:          os.Getenv("TIMESTAMP_FP"),
			ShortDescription:   "Face Payment Description",
			LongDescription:    "Face Payment Looonng Descriptiooonnn",
			SpecialInstruction: "Special Instruction for Face Payment",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "OCR Receipt Recognition",
			Type:               "innovation",
			Slug:               "ocr-receipt",
			Thumbnail:          "ocr-receipt.png",
			AccessKey:          "",
			Token:             	"",
			Timestamp:          "",
			ShortDescription:   "Read the characters on a shopping receipt issued by various supermarkets.",
			LongDescription:    "OCR Receipt Recognition has the ability to read the characters on a shopping receipt issued by various supermarkets.",
			SpecialInstruction: "Special Instruction for OCR Receipt Recognition",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		// Add new service here
	}

	for _, service := range services {
		model.CreateService(&service)
	}
}

func Seed(db *gorm.DB) {
	model := models.New(db)
	sessionIds := seedVisitor(model)
	seedService(model)
	seedVisitorActivity(model, sessionIds)
}
