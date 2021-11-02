package controllers

import (
	"backend/database"
	"backend/models"
	"backend/utils"
	"fmt"
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

func GetEKYCResult(ctx *gin.Context) {
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
	resultFaceLiveness, err := getResultFaceLiveness(service, inputData.Data.FaceLiveness)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": "Error during fetching API face liveness: " + err.Error(),
		})
		return
	}
	resultOCRKTP, err := getResultOCRKTP(service, inputData.Data.OCRKTP)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": "Error during fetching API ocr ktp: " + err.Error(),
		})
		return
	}
	resultFaceMatch, err := getResultFaceMatch(service, inputData.Data.FaceMatch)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": "Error during fetching API face match: " + err.Error(),
		})
		return
	}

	var serviceData ekycServiceData
	serviceData.FaceLiveness = resultFaceLiveness
	serviceData.OCRKTP = resultOCRKTP
	serviceData.FaceMatch = resultFaceMatch

	ctx.JSON(http.StatusOK, gin.H{
		"ok":           true,
		"message":      "Service demo request success",
		"service_data": &serviceData,
	})

}

func getResultFaceLiveness(service models.Service, input models.RequestData) (models.ServiceRequestResultData, error) {
	fmt.Println(input)
	var result models.ServiceRequestResultData
	dataAnalytic := GetDataAnalytic(service, input)
	result, err := RequestToAnalyticSync(dataAnalytic, "face-liveness")
	if err != nil {
		fmt.Println("Error during fetching API face liveness: ", err)
		return result, err
	}
	return result, nil
}

func getResultOCRKTP(service models.Service, input models.RequestData) (models.ServiceRequestResultData, error) {
	var result models.ServiceRequestResultData
	dataAnalytic := GetDataAnalytic(service, input)
	result, err := RequestToAnalyticSync(dataAnalytic, "ocr-ktp")
	if err != nil {
		fmt.Println("Error during fetching API ocr ktp: ", err)
		return result, err
	}
	return result, nil
}

func getResultFaceMatch(service models.Service, input models.RequestData) (models.ServiceRequestResultData, error) {
	var result models.ServiceRequestResultData
	dataAnalytic := GetDataAnalytic(service, input)
	result, err := RequestToAnalyticSync(dataAnalytic, "face-match")
	if err != nil {
		fmt.Println("Error during fetching API face match: ", err)
		return result, err
	}
	return result, nil
}
