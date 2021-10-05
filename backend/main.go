package main

import (
	"backend/database"
)

func main() {
	db := database.InitDB()

	// Migrate
	database.Migrate(db)

	// Seed
	database.Seed(db)

	r := SetupRouter()
	_ = r.Run(":8080")

	defer database.CloseDB(db)
}
