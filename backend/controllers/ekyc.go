package controllers

import (
	"backend/database"
	"backend/models"
	"backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ekycRequestData struct {
	FaceLiveness models.RequestData `json:"face_liveness"`
	OCRKTP       models.RequestData `json:"ocr_ktp"`
	FaceMatch    models.RequestData `json:"face_match"`
}

type ekycRequestInput struct {
	SessionID string          `json:"session_id"`
	Data      ekycRequestData `json:"data"`
}

type ekycServiceData struct {
	FaceLiveness models.ServiceRequestResultData `json:"face_liveness"`
	OCRKTP       models.ServiceRequestResultData `json:"ocr_ktp"`
	FaceMatch    models.ServiceRequestResultData `json:"face_match"`
}

func CreateEKYCRequest(ctx *gin.Context) {
	var inputData ekycRequestInput
	ctx.BindJSON(&inputData)
	sessionId := inputData.SessionID

	// Check if session is not exist in our record
	if !utils.IsSessionExist(sessionId) {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"ok":      false,
			"message": "Session ID is not valid",
		})
		return
	}

	// Check if session has expired
	if utils.IsSessionExpired(sessionId) {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"ok":      false,
			"message": "Session ID has expired",
		})
		return
	}

	var service models.Service
	db := database.GetDB()
	models.GetServiceBySlug(db, &service, "ekyc")

	ImplementEKYCSolution(ctx, service, inputData)
}

func ImplementEKYCSolution(ctx *gin.Context, service models.Service, inputData ekycRequestInput) {
	// Declare channels
	resultFaceLivenessChannel := make(chan models.ServiceRequestResultData)
	resultOCRKTPChannel := make(chan models.ServiceRequestResultData)
	resultFaceMatchChannel := make(chan models.ServiceRequestResultData)
	errorFaceLivenessChannel := make(chan error)
	errorOCRKTPChannel := make(chan error)
	errorFaceMatchChannel := make(chan error)

	// Create and execute goroutines
	go func() {
		resultFaceLiveness, err := GetResultFaceLiveness(service, inputData.Data.FaceLiveness)
		errorFaceLivenessChannel <- err
		resultFaceLivenessChannel <- resultFaceLiveness
	}()
	go func() {
		resultOCRKTP, err := GetResultOCRKTP(service, inputData.Data.OCRKTP)
		errorOCRKTPChannel <- err
		resultOCRKTPChannel <- resultOCRKTP
	}()
	go func() {
		resultFaceMatch, err := GetResultFaceMatch(service, inputData.Data.FaceMatch)
		errorFaceMatchChannel <- err
		resultFaceMatchChannel <- resultFaceMatch
	}()

	var serviceData ekycServiceData
	var err error = nil

	// Share the results with channel - select
	for i := 0; i < 3; i++ {
		select {
		case resultFaceLiveness := <-resultFaceLivenessChannel:
			serviceData.FaceLiveness = resultFaceLiveness
		case resultOCRKTP := <-resultOCRKTPChannel:
			serviceData.OCRKTP = resultOCRKTP
		case resultFaceMatch := <-resultFaceMatchChannel:
			serviceData.FaceMatch = resultFaceMatch
		case errorFaceLiveness := <-errorFaceLivenessChannel:
			err = errorFaceLiveness
		case errorOCRKTP := <-errorOCRKTPChannel:
			err = errorOCRKTP
		case errorFaceMatch := <-errorFaceMatchChannel:
			err = errorFaceMatch
		}
	}

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":           false,
			"message":      err.Error(),
			"service_data": &serviceData,
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"ok":           true,
		"message":      "Service demo request success",
		"service_data": &serviceData,
	})

}
