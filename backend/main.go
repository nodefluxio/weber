package main

import (
	"backend/controllers"
	"backend/database"
	"backend/models"
	"backend/utils"
	"os"

	log "github.com/sirupsen/logrus"
	"github.com/subosito/gotenv"
)

func init() {
	gotenv.Load()

	// Log as JSON instead of the default ASCII formatter.
	log.SetFormatter(&log.JSONFormatter{})

	// Output to stdout instead of the default stderr
	// Can be any io.Writer, see below for File example
	log.SetOutput(os.Stdout)

	// Only log the warning severity or above.
	log.SetLevel(log.WarnLevel)
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
