package models

import "gorm.io/gorm"

type Model struct {
	DBConn *gorm.DB
}

func New(db *gorm.DB) *Model {
	return &Model{DBConn: db}
}
