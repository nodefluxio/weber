package main

import (
	"backend/database"
	"backend/models"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func connectAndMigrate() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	dbUsername := os.Getenv("DB_USERNAME")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta", dbHost, dbUsername, dbPassword, dbName, dbPort)

	database.InitDb(dsn)
	database.DB.AutoMigrate(&models.Visitor{})
	database.DB.AutoMigrate(&models.Feedback{})
	database.DB.AutoMigrate(&models.VisitorActivity{})
	database.DB.AutoMigrate(&models.Service{})
	seedDatabase()
}

func seedDatabase() {
	models.CreateVisitor(&models.Visitor{CookieID: "asdfghjkl123", FullName: "Lazuardy Khatulistiwa"})
}

func main() {
	connectAndMigrate()
	r := setupRouter()
	_ = r.Run(":8080")
}

func setupRouter() *gin.Engine {
	r := gin.Default()

	r.GET("ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, "pong")
	})

	return r
}
