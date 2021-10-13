package main

import (
	"backend/database"
	"backend/utils"
	"os"
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

	utils.LoadEnv()
	port := os.Getenv("APP_PORT")
	_ = r.Run(":" + port)
}
