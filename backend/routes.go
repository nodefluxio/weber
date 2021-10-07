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

	r.GET("/services", func(ctx *gin.Context) {
		serviceType := ctx.Query("type")
		controllers.CheckServiceType(serviceType, ctx)
	})

	return r
}