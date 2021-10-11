package main

import (
	"backend/controllers"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.GET("ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, "pong")
	})

	visitors := r.Group("/visitors")
	{
		visitors.POST("", controllers.CreateVisitor)
	}
	return r
}
