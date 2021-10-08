package database

import (
	"backend/models"

	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) {
	db.AutoMigrate(&models.Visitor{})
	db.AutoMigrate(&models.Feedback{})
	db.AutoMigrate(&models.VisitorActivity{})
	db.AutoMigrate(&models.Service{})
}
