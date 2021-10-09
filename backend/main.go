package main

import (
	"backend/controllers"
	"backend/database"
)

func main() {
	db := database.InitDB()

	// Init Translation for Validator
	controllers.InitTranslation()

	// Migrate
	database.Migrate(db)

	// Seed
	database.Seed(db)

	r := SetupRouter()
	_ = r.Run(":8080")
}
