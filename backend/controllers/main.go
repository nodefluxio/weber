package controllers

import (
	"backend/models"

	"gorm.io/gorm"
)

type Controller struct {
	// We define two attributes here because our model still inconsistent
	// there is direct query using GORM interface and custom abstraction
	Model  *models.Model
	DBConn *gorm.DB
}

func New(model *models.Model) *Controller {
	return &Controller{
		Model:  model,
		DBConn: model.DBConn,
	}
}
