package database

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDb(dsn string) *gorm.DB {
	DB = connectDB(dsn)
	return DB
}

func connectDB(dsn string) *gorm.DB {
	var err error
	// dsn := "host=localhost user=postgres password=postgres dbname=insight port=5432 sslmode=disable TimeZone=Asia/Jakarta"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		fmt.Println("Error connecting to database: error = %v", err)
		return nil
	}

	return db
}
