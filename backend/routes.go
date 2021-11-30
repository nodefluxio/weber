package main

import (
	"backend/controllers"
	"net/http"

	"github.com/sirupsen/logrus"
	ginlogrus "github.com/toorop/gin-logrus"

	"github.com/gin-gonic/gin"
)

func SetupRouter(ctrl *controllers.Controller) *gin.Engine {

	log := logrus.New()
	log.SetFormatter(&logrus.JSONFormatter{
		TimestampFormat: "2006-01-02 15:04:05",
	})

	r := gin.Default()

	r.Use(CORSMiddleware(), ginlogrus.Logger(log))

	r.GET("ping", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, "pong")
	})

	apis := r.Group("/api/v1")
	{
		services := apis.Group("/services")
		{
			services.GET("", ctrl.GetServices)
			services.GET("/:slug", ctrl.GetServiceBySlug)

			services.POST("/:id", ctrl.CreateServiceRequest)
		}

		visitors := apis.Group("/visitors")
		{
			visitors.POST("", ctrl.CreateVisitor)
		}

		activities := apis.Group("/activities")
		{
			activities.POST("", ctrl.CreateActivity)
		}

		feedbacks := apis.Group("/feedback")
		{
			feedbacks.POST("/:service_id", ctrl.CreateFeedback)
		}

		ekyc := apis.Group("/ekyc")
		{
			ekyc.POST("", ctrl.CreateEKYCRequest)
		}

		facePayments := apis.Group("/face-payment")
		{
			facePayments.GET("/account/:session_id", ctrl.GetActiveAccountBySessionID)

			facePayments.POST("/account", ctrl.CreateFacePaymentAccount)
			facePayments.POST("/pay", ctrl.CreateTransaction)

			facePayments.PATCH("/account", ctrl.UpdateFacePaymentAccount)
			facePayments.PATCH("/reset-balance/:session_id", ctrl.ResetBalanceFacePaymentAccount)
		}
	}

	return r
}
