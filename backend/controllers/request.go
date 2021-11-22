package controllers

import (
	"backend/models"
	"encoding/json"
	"fmt"
	"image"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/mitchellh/mapstructure"
)

type Thumbnails []string

func RequestToServiceAnalytics(ctx *gin.Context, service models.Service, inputData models.ServiceRequestInput) {
	var serviceData models.ServiceRequestResultData
	var err error

	if service.Slug == "face-match-enrollment" {
		inputData.Data.AdditionalParams = map[string]interface{}{"face_id": os.Getenv("FACE_ID")}
	}

	dataAnalytic := GetDataAnalytic(service, inputData.Data)
	serviceData, err = RequestToAnalyticSync(dataAnalytic, service.Slug)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	thumbnails := make(Thumbnails, 0)
	img, cfg, _ := DecodeBase64Image(inputData.Data.Images[0])
	parseMap(serviceData.Job.Result, img, cfg, &thumbnails)

	ctx.JSON(http.StatusOK, gin.H{
		"ok":           true,
		"message":      "Service demo request success",
		"service_data": &serviceData,
		"thumbnails":   &thumbnails,
	})
}

func RequestToServiceInnovation(ctx *gin.Context, service models.Service, inputData models.ServiceRequestInput) {
	var err error

	requestData := inputData.Data
	additionalParams, _ := json.Marshal(requestData.AdditionalParams)
	postBody := []byte(fmt.Sprintf(`{ "additional_params": %v , "images":  [ "%v" ]}`,
		string(additionalParams), strings.Join(requestData.Images, `", "`)))

	serviceData, err := RequestToInnovationSync(postBody, service.Slug)

	if err != nil {
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

func parseMap(aMap map[string]interface{}, img image.Image, cfg image.Config, thumbnails *Thumbnails) {
	for key, val := range aMap {
		switch val.(type) {
		case map[string]interface{}:
			if key == "bounding_box" {
				var bbox models.BoundingBox
				err := mapstructure.Decode(val, &bbox)
				if err != nil {
					log.Println("Failed to decode bounding_box, err=", err)
				} else {
					thumbnail, id, err := CropImage(img, cfg, bbox)
					if err != nil {
						log.Println("Failed to crop image, err=", err)
					} else {
						log.Println("Generating thumbnail for bbox=...", id)
						*thumbnails = append(*thumbnails, thumbnail)
					}
				}
			}
			parseMap(val.(map[string]interface{}), img, cfg, thumbnails)
		case []interface{}:
			parseArray(val.([]interface{}), img, cfg, thumbnails)
		}
	}
}

func parseArray(anArray []interface{}, img image.Image, cfg image.Config, thumbnails *Thumbnails) {
	for _, val := range anArray {
		switch val.(type) {
		case map[string]interface{}:
			parseMap(val.(map[string]interface{}), img, cfg, thumbnails)
		case []interface{}:
			parseArray(val.([]interface{}), img, cfg, thumbnails)
		}
	}
}
