package main

import (
	"backend/controllers"
	"backend/database"
	"backend/models"
	"backend/utils"
	"os"

	"github.com/subosito/gotenv"
)

func init() {
	gotenv.Load()
}

func main() {
	// Initialize DB Connection
	db := database.InitDB()

	// Create Model
	model := models.New(db)

	// Create Controller
	ctrl := controllers.New(model)

	// Handle args for database purposes
	handleArgs(db)

	// Init Translation for Validator
	utils.InitTranslation()

	r := SetupRouter(ctrl)

	host := os.Getenv("APP_HOST")
	port := os.Getenv("APP_PORT")

	_ = r.Run(host + ":" + port)
}
