package database

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func GetDB(dsn string) *gorm.DB {
	// DB = initDB()
	return DB
}

func InitDB() *gorm.DB {

	err2 := godotenv.Load()
	if err2 != nil {
		log.Fatal("Error loading .env file")
	}

	dbUsername := os.Getenv("DB_USERNAME")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta", dbHost, dbUsername, dbPassword, dbName, dbPort)

	var err error
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		fmt.Println("Error connecting to database: error = %v", err)
		return nil
	}

	return db
}

func CloseDB(db *gorm.DB) {
	sqlDB, _ := db.DB()
	sqlDB.Close()
}
