package controllers

import (
	"backend/models"

	"gorm.io/gorm"
)

type Controller struct {
	// We define two attributes here because our model still inconsistent
	// there are 2 methods found when accessing data layer:
	// 1. Using direct query using GORM interface
	// 2. Using custom abstraction
	Model  *models.Model
	DBConn *gorm.DB
}

func New(model *models.Model) *Controller {
	return &Controller{
		Model:  model,
		DBConn: model.DBConn,
	}
}
