package controllers

import (
	"backend/models"
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	"github.com/tidwall/gjson"
)

type faceOcclusionAttributeServiceData struct {
	FaceOcclusion	models.ServiceRequestResultData `json:"face_occlusion"`
	FaceAttribute	models.ServiceRequestResultData `json:"face_attribute"`
}

func RequestToInnovationSync(postBody []byte, innovationSlug string) (models.ServiceRequestResultData, error) {
	var err error
	var request *http.Request
	var data models.ServiceRequestResultData

	BASE_URL := fmt.Sprintf("%s/%s/predict", os.Getenv("URL_INNOVATIONS"), innovationSlug)
	payload := bytes.NewBuffer(postBody)
	request, err = http.NewRequest("POST", BASE_URL, payload)

	if err != nil {
		log.WithFields(log.Fields{
			"error":    err,
			"data":     data,
			"payload":  payload,
			"base_url": BASE_URL,
			"slug":     innovationSlug,
			"method":   "POST",
		}).Error("error on send http new request to innovation!")
	}

	request.Header.Set("Content-Type", "application/json")

	var client = &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		log.WithFields(log.Fields{
			"error":   err,
			"data":    data,
			"request": request,
		}).Error("error on request to innovation!")
		return data, err
	}

	defer response.Body.Close()

	err = json.NewDecoder(response.Body).Decode(&data)
	if err != nil {
		log.WithFields(log.Fields{
			"error":         err,
			"data":          data,
			"response_body": response.Body,
		}).Error("error on decode response body!")
		return data, err
	}

	return data, nil
}

func RequestToFaceOcclusionAttribute(ctx *gin.Context, postBody []byte) {
	// Request to Face Detection API
	resultFaceDetection, err := RequestToInnovationSync(postBody, "face-detection")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	resultFaceDetectionJson, err := json.Marshal(resultFaceDetection)
	if err != nil {
		log.WithFields(log.Fields{
			"error":     	err,
			"json_result": 	resultFaceDetectionJson,
			"slug":      	"face-detection",
		}).Error("error on marshaling json result")

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	// Error response if face not detected
	isFaceDetected := gjson.Get(string(resultFaceDetectionJson), "job.result.result.0.face_detection.face_detected").Bool()
	if !isFaceDetected {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"ok":      false,
			"message": &resultFaceDetection.Message,
		})
		return
	}

	// Error response if multiple faces detected
	isMultipleFaceDetected := gjson.Get(string(resultFaceDetectionJson), "job.result.result.0.face_detection.multiple_faces_detected").Bool()
	if isMultipleFaceDetected {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"ok":      false,
			"message": &resultFaceDetection.Message,
		})
		return
	}

	// Get image base64 string for input Face Occlusion & Attribute
	inputFaceOcclusion := gjson.Get(string(resultFaceDetectionJson), "job.result.result.0.face_detection.result.input_face_occlusion.0").String()
	inputFaceAttribute := gjson.Get(string(resultFaceDetectionJson), "job.result.result.0.face_detection.result.input_face_attribute.0").String()
	
	// Declare channels
	resultFaceOcclusionChannel := make(chan models.ServiceRequestResultData)
	resultFaceAttributeChannel := make(chan models.ServiceRequestResultData)
	errorFaceOcclusionChannel := make(chan error)
	errorFaceAttributeChannel := make(chan error)

	// Create and execute goroutines
	go func() {
		postBody := []byte(fmt.Sprintf(`{"images":  [ "%v" ]}`, inputFaceOcclusion))
		resultFaceOcclusion, err := RequestToInnovationSync(postBody, "face-occlusion")
		errorFaceOcclusionChannel <- err
		resultFaceOcclusionChannel <- resultFaceOcclusion
	}()
	go func() {
		postBody := []byte(fmt.Sprintf(`{"images":  [ "%v" ]}`, inputFaceAttribute))
		resultFaceAttribute, err := RequestToInnovationSync(postBody, "face-attribute")
		errorFaceAttributeChannel <- err
		resultFaceAttributeChannel <- resultFaceAttribute
	}()
	
	var serviceData faceOcclusionAttributeServiceData

	// Share the results with channel - select
	for i := 0; i < 4; i++ {
		select {
		case resultFaceOcclusion := <-resultFaceOcclusionChannel:
			serviceData.FaceOcclusion = resultFaceOcclusion
		case resultFaceAttribute := <-resultFaceAttributeChannel:
			serviceData.FaceAttribute = resultFaceAttribute
		case errorFaceOcclusion := <-errorFaceOcclusionChannel:
			err = errorFaceOcclusion
		case errorFaceAttribute := <-errorFaceAttributeChannel:
			err = errorFaceAttribute
		}
	}

	if err != nil {
		log.WithFields(log.Fields{
			"error":        err,
			"service_data": serviceData,
		}).Error("error on implement face occlusion & attribute innovation")

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"ok":           true,
		"message":      "Service demo request success",
		"service_data": &serviceData,
	})
}