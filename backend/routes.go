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

	services := r.Group("/services")
	{
		services.GET("", controllers.GetServices)
		services.GET("/:slug", controllers.GetServiceBySlug)

		services.POST("/:id", controllers.CreateServiceRequest)
	}

	visitors := r.Group("/visitors")
	{
		visitors.POST("", controllers.CreateVisitor)
	}

	activities := r.Group("/activities")
	{
		activities.POST("", controllers.CreateActivity)
	}

	feedbacks := r.Group("/feedback")
	{
		feedbacks.POST("/:service_id", controllers.CreateFeedback)
	}

	ekyc := r.Group("/ekyc")
	{
		ekyc.POST("", controllers.GetEKYCResult)
	}

	return r
}
