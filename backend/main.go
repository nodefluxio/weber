package main

import (
	"backend/database"
	"backend/utils"
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
	_ = r.Run(":8080")
}
