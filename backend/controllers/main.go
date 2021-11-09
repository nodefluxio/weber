package controllers

import "gorm.io/gorm"

type Controller struct {
	dbConn *gorm.DB
}

func New(dbConn *gorm.DB) *Controller {
	return &Controller{
		dbConn: dbConn,
	}
}
