package main

import (
	"backend/database"
	"flag"
	"fmt"
	"os"

	"gorm.io/gorm"
)

func handleArgs(db *gorm.DB) {
	flag.Parse()
	args := flag.Args()

	if len(args) >= 1 {
		switch args[0] {
		case "migrate":
			database.Migrate(db)
			fmt.Println("Migration without removing the data has been run successfully.")
			os.Exit(0)
		case "migrate-fresh":
			database.DropTable(db)
			database.Migrate(db)
			fmt.Println("Migration with removing the data has been run successfully.")
			os.Exit(0)
		case "seed":
			database.Seed(db)
			fmt.Println("Seeding the database has been run successfully.")
			os.Exit(0)
		case "refresh":
			database.DropTable(db)
			database.Migrate(db)
			database.Seed(db)
			fmt.Println("Migration with removing the data and seeding the database has been run successfully.")
			os.Exit(0)
		}
	}
}
