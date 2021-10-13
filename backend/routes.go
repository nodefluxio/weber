package main

import (
	"backend/controllers"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.GET("ping", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, "pong")
	})

	services := r.Group("/services") 
	{
		// GET Method
		services.GET("", controllers.GetServicesByType)
		services.GET("/:id", controllers.GetServiceById)

		// POST Method
		services.POST("/:id", controllers.CreateServiceRequest)
	}

	visitors := r.Group("/visitors")
	{
		visitors.POST("", controllers.CreateVisitor)
	}
	return r
}
