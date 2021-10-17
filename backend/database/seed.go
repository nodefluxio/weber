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
			Thumbnail:        "ocr-ktp.jpg",
			AccessKey:        os.Getenv("ACCESS_KEY"),
			Token:            os.Getenv("TOKEN"),
			Timestamp:        os.Getenv("TIMESTAMP"),
			ShortDescription: "OCR KTP Description",
			LongDescription:  "OCR KTP Looonng Descriptiooonnn",
			CreatedAt:        time.Now(),
			UpdatedAt:        time.Now(),
		},
		{
			Name:             "License Plate Recognition",
			Type:             "analytic",
			Slug:             "license-plate-recognition",
			Thumbnail:        "license-plate-recognition.jpg",
			AccessKey:        os.Getenv("ACCESS_KEY"),
			Token:            os.Getenv("TOKEN"),
			Timestamp:        os.Getenv("TIMESTAMP"),
			ShortDescription: "LPR Description",
			LongDescription:  "LPR Looonng Descriptiooonnn",
			CreatedAt:        time.Now(),
			UpdatedAt:        time.Now(),
		},
		{
			Name:             "Face Match with Enrollment",
			Type:             "analytic",
			Slug:             "face-match-enrollment",
			Thumbnail:        "face-match-enrollment.jpg",
			AccessKey:        "cxbahwqkhwqiuwhqj834i32h4i32uhy99",
			Token:            "34c513672bb7c4918d52cea989fba1060f8084ece5135df5155c2dec2d98cff1",
			Timestamp:        "20211010T104645Z",
			ShortDescription: "Face Match with Enrollment Description",
			LongDescription:  "Face Match with Enrollment Looonng Descriptiooonnn",
			CreatedAt:        time.Now(),
			UpdatedAt:        time.Now(),
		},
		{
			Name:             "Face Recognition",
			Type:             "analytic",
			Slug:             "face-recognition",
			Thumbnail:        "face-recognition.jpg",
			AccessKey:        "dgbahwqkhwqiuwhqj834hj2h4i32uhy69",
			Token:            "34c513672bb7c4918d52cea989fba1060f8084ece5135df5155c2dec2d98cff1",
			Timestamp:        "20211010T104645Z",
			ShortDescription: "Face Recognition Description",
			LongDescription:  "Face Recognition Looonng Descriptiooonnn",
			CreatedAt:        time.Now(),
			UpdatedAt:        time.Now(),
		},
		{
			Name:             "Electronic Know Your Customer",
			Type:             "solution",
			Slug:             "ekyc",
			Thumbnail:        "ekyc.jpg",
			AccessKey:        "xxabahwqkhwqiuwhqj834hj2h4i32uny69",
			Token:            "34c513672bb7c4918d52cea989fba1060f8084ece5135df5155c2dec2d98cff1",
			Timestamp:        "20211010T104645Z",
			ShortDescription: "Electronic Know Your Customer Description",
			LongDescription:  "Electronic Know Your Customer Looonng Descriptiooonnn",
			CreatedAt:        time.Now(),
			UpdatedAt:        time.Now(),
		},
		{
			Name:             "Rotten Fruit Detection",
			Type:             "innovation",
			Slug:             "rotten-fruit",
			Thumbnail:        "rotten-fruit.jpg",
			AccessKey:        "plrbahwqkhwqiuwhqj834hj2h4i32uny69",
			Token:            "34c513672bb7c4918d52cea989fba1060f8084ece5135df5155c2dec2d98cff1",
			Timestamp:        "20211010T104645Z",
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
