package database

import (
	"backend/models"
	"fmt"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func seedVisitor(db *gorm.DB) {
	sessionId := uuid.New()
	fmt.Println(sessionId.String())
	var visitor = models.Visitor{
		SessionID: sessionId.String(),
		Email:     "lazuardy@nodeflux.io",
		FullName:  "Lazuardy Khatulistiwa",
		Company:   "Nodeflux",
		JobTitle:  "Software Engineer",
		Industry:  "Computer Vision",
		// CreatedAt: time.Date(2021, time.October, 1, 10, 10, 10, 10, time.Local), // for test session expiration
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	models.CreateVisitor(db, &visitor)
}

func Seed(db *gorm.DB) {
	seedVisitor(db)
}
