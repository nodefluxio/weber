package database

import (
	"backend/models"
	"os"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func seedVisitor(db *gorm.DB) {
	var visitors = []models.Visitor{
		{
			SessionID: "",
			Email:     "lazuardy@nodeflux.io",
			FullName:  "Lazuardy Khatulistiwa",
			Company:   "Nodeflux",
			JobTitle:  "Software Engineer",
			Industry:  "Computer Vision",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			SessionID: "",
			Email:     "sndztx@nodeflux.io",
			FullName:  "Sonadz Tux",
			Company:   "Nodeflux",
			JobTitle:  "Software Engineer",
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

	for _, visitor := range visitors {
		sessionId := uuid.New()
		visitor.SessionID = sessionId.String()
		models.CreateVisitor(db, &visitor)
	}
}

func seedService(db *gorm.DB) {
	// all tokens and access keys provided here are just a random example
	var services = []models.Service{
		{
			Name:             "Optical Character Recognition KTP",
			Type:             "analytic",
			Slug:             "ocr-ktp",
			Thumbnail:        "ocr-ktp.png",
			AccessKey:        os.Getenv("ACCESS_KEY_OCR"),
			Token:            os.Getenv("TOKEN_OCR"),
			Timestamp:        os.Getenv("TIMESTAMP_OCR"),
			ShortDescription: "OCR KTP Description",
			LongDescription:  "OCR KTP Looonng Descriptiooonnn",
			CreatedAt:        time.Now(),
			UpdatedAt:        time.Now(),
		},
		{
			Name:             "License Plate Recognition",
			Type:             "analytic",
			Slug:             "license-plate-recognition",
			Thumbnail:        "license-plate-recognition.png",
			AccessKey:        os.Getenv("ACCESS_KEY_LPR"),
			Token:            os.Getenv("TOKEN_LPR"),
			Timestamp:        os.Getenv("TIMESTAMP_LPR"),
			ShortDescription: "LPR Description",
			LongDescription:  "LPR Looonng Descriptiooonnn",
			CreatedAt:        time.Now(),
			UpdatedAt:        time.Now(),
		},
		{
			Name:             "Face Match with Enrollment",
			Type:             "analytic",
			Slug:             "face-match-enrollment",
			Thumbnail:        "face-match-enrollment.png",
			AccessKey:        os.Getenv("ACCESS_KEY_FME"),
			Token:            os.Getenv("TOKEN_FME"),
			Timestamp:        os.Getenv("TIMESTAMP_FME"),
			ShortDescription: "Face Match with Enrollment Description",
			LongDescription:  "Face Match with Enrollment Looonng Descriptiooonnn",
			CreatedAt:        time.Now(),
			UpdatedAt:        time.Now(),
		},
		{
			Name:             "Face Recognition",
			Type:             "analytic",
			Slug:             "face-recognition",
			Thumbnail:        "face-recognition.png",
			AccessKey:        os.Getenv("ACCESS_KEY_FR"),
			Token:            os.Getenv("TOKEN_FR"),
			Timestamp:        os.Getenv("TIMESTAMP_FR"),
			ShortDescription: "Face Recognition Description",
			LongDescription:  "Face Recognition Looonng Descriptiooonnn",
			CreatedAt:        time.Now(),
			UpdatedAt:        time.Now(),
		},
		{
			Name:             "Face Liveness",
			Type:             "analytic",
			Slug:             "face-liveness",
			Thumbnail:        "face-liveness.png",
			AccessKey:        os.Getenv("ACCESS_KEY_FL"),
			Token:            os.Getenv("TOKEN_FL"),
			Timestamp:        os.Getenv("TIMESTAMP_FL"),
			ShortDescription: "Face Liveness Description",
			LongDescription:  "Face Liveness Looonng Descriptiooonnn",
			CreatedAt:        time.Now(),
			UpdatedAt:        time.Now(),
		},
		{
			Name:             "Electronic Know Your Customer",
			Type:             "solution",
			Slug:             "ekyc",
			Thumbnail:        "ekyc.png",
			AccessKey:        os.Getenv("ACCESS_KEY_EKYC"),
			Token:            os.Getenv("TOKEN_EKYC"),
			Timestamp:        os.Getenv("TIMESTAMP_EKYC"),
			ShortDescription: "Electronic Know Your Customer Description",
			LongDescription:  "Electronic Know Your Customer Looonng Descriptiooonnn",
			CreatedAt:        time.Now(),
			UpdatedAt:        time.Now(),
		},
		{
			Name:             "Rotten Fruit Detection",
			Type:             "innovation",
			Slug:             "rotten-fruit",
			Thumbnail:        "rotten-fruit.png",
			AccessKey:        os.Getenv("ACCESS_KEY_RFD"),
			Token:            os.Getenv("TOKEN_RFD"),
			Timestamp:        os.Getenv("TIMESTAMP_RFD"),
			ShortDescription: "Rotten Fruit Detection Description",
			LongDescription:  "Rotten Fruit Detection Looonng Descriptiooonnn",
			CreatedAt:        time.Now(),
			UpdatedAt:        time.Now(),
		},
		// Add new service here
	}

	for _, service := range services {
		models.CreateService(db, &service)
	}
}

func Seed(db *gorm.DB) {
	seedVisitor(db)
	seedService(db)
}
