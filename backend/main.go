package main

import (
	"backend/database"
	"backend/utils"
	"os"
)

func main() {
	db := database.InitDB()

	// Handle args for database purposes
	handleArgs(db)

	// Init Translation for Validator
	utils.InitTranslation()

	r := SetupRouter()

	host := os.Getenv("APP_HOST")
	port := os.Getenv("APP_PORT")

	_ = r.Run(host + ":" + port)
}
