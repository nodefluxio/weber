package main

import (
	"backend/controllers"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	r.Use(CORSMiddleware())

	r.GET("ping", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, "pong")
	})

	apis := r.Group("/api/v1")
	{
		services := apis.Group("/services")
		{
			services.GET("", controllers.GetServices)
			services.GET("/:slug", controllers.GetServiceBySlug)
	
			services.POST("/:id", controllers.CreateServiceRequest)
		}
	
		visitors := apis.Group("/visitors")
		{
			visitors.POST("", controllers.CreateVisitor)
		}
	
		activities := apis.Group("/activities")
		{
			activities.POST("", controllers.CreateActivity)
		}
	
		feedbacks := apis.Group("/feedback")
		{
			feedbacks.POST("/:service_id", controllers.CreateFeedback)
		}
	}

	return r
}
