package main

import (
	"backend/controllers"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.GET("ping", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, "pong")
	})

	services := r.Group("/services") 
	{
		services.GET("", func(ctx *gin.Context) {
			serviceType := ctx.Query("type")
			controllers.CheckServiceType(serviceType, ctx)
		})

		services.GET("/:id", func(ctx *gin.Context) {
			serviceId, _ := strconv.Atoi(ctx.Param("id"))
			controllers.GetServiceById(serviceId, ctx)
		})
	}

	visitors := r.Group("/visitors")
	{
		visitors.POST("", controllers.CreateVisitor)
	}
	return r
}
