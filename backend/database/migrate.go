package database

import (
	"backend/models"

	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) {
	// To clean up previous created records
	// db.Migrator().DropTable(&models.Visitor{})
	// db.Migrator().DropTable(&models.Feedback{})
	// db.Migrator().DropTable(&models.VisitorActivity{})
	// db.Migrator().DropTable(&models.Service{})

	db.AutoMigrate(&models.Visitor{})
	db.AutoMigrate(&models.Feedback{})
	db.AutoMigrate(&models.VisitorActivity{})
	db.AutoMigrate(&models.Service{})
}
