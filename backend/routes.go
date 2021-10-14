package main

import (
	"backend/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	r.Use(CORSMiddleware())

	services := r.Group("/services")
	{
		// GET Method
		services.GET("", controllers.GetServicesByType)
		services.GET("/:id", controllers.GetServiceById)
	}

	visitors := r.Group("/visitors")
	{
		visitors.POST("", controllers.CreateVisitor)
	}
	return r
}
