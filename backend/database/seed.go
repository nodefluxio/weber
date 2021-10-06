package database

import (
	"backend/models"

	"gorm.io/gorm"
)

func Seed(db *gorm.DB) {
	models.CreateVisitor(db, &models.Visitor{CookieID: "asdfghjkl123", FullName: "Lazuardy Khatulistiwa"})
}
