package database

import (
	"backend/models"
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
	var services = []models.Service{
		{
			ApiKey:				"aqkhwqkhwqiuwhqj",
			Type:				"analytic",
			Slug:   			"ocr-ktp",
			Name:				"Optical Character Recognition KTP",
			ShortDescription:	"OCR KTP Description",
			LongDescription: 	"OCR KTP Looonng Descriptiooonnn",
			Thumbnail: 			"ocr-ktp.jpg",
			CreatedAt: 			time.Now(),
			UpdatedAt: 			time.Now(),
		},
		{
			ApiKey:				"bqkhwqkhwqiuwhqj",
			Type:				"analytic",
			Slug:   			"license-plate-recognition",
			Name:				"License Plate Recognition",
			ShortDescription:	"LPR Description",
			LongDescription: 	"LPR Looonng Descriptiooonnn",
			Thumbnail: 			"license-plate-recognition.jpg",
			CreatedAt: 			time.Now(),
			UpdatedAt: 			time.Now(),
		},
		{
			ApiKey:				"cxkhwqkhwqiuwhqj",
			Type:				"analytic",
			Slug:   			"face-recognition",
			Name:				"Face Recognition",
			ShortDescription:	"Face Recognition Description",
			LongDescription: 	"Face Recognition Looonng Descriptiooonnn",
			Thumbnail: 			"face-recognition.jpg",
			CreatedAt: 			time.Now(),
			UpdatedAt: 			time.Now(),
		},
		{
			ApiKey:				"damnhwqkhwqiuwhqj",
			Type:				"solution",
			Slug:   			"ekyc",
			Name:				"Electronic Know Your Customer",
			ShortDescription:	"Electronic Know Your Customer Description",
			LongDescription: 	"Electronic Know Your Customer Looonng Descriptiooonnn",
			Thumbnail: 			"ekyc.jpg",
			CreatedAt: 			time.Now(),
			UpdatedAt: 			time.Now(),
		},
		{
			ApiKey:				"eaaahwqkhwqiuwhqj",
			Type:				"innovation",
			Slug:   			"rotten-fruit",
			Name:				"Rotten Fruit Detection",
			ShortDescription:	"Rotten Fruit Detection Description",
			LongDescription: 	"Rotten Fruit Detection Looonng Descriptiooonnn",
			Thumbnail: 			"rotten-fruit.jpg",
			CreatedAt: 			time.Now(),
			UpdatedAt: 			time.Now(),
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
