package main

import (
	"backend/database"
	"backend/utils"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	db := database.InitDB()

	// Init Translation for Validator
	utils.InitTranslation()

	// Migrate
	database.Migrate(db)

	// Seed
	database.Seed(db)

	r := SetupRouter()

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	port := os.Getenv("APP_PORT")
	_ = r.Run(":" + port)
}
