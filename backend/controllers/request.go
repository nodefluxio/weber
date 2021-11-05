package controllers

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func RequestToServiceAnalytics(ctx *gin.Context, service models.Service, inputData models.ServiceRequestInput) {
	var serviceData models.ServiceRequestResultData
	var err error
	dataAnalytic := GetDataAnalytic(service, inputData.Data)
	serviceData, err = RequestToAnalyticSync(dataAnalytic, service.Slug)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	var thumbnails []string
	parseMap(data.Job.Result, &thumbnails)
	fmt.Println(thumbnails)

	ctx.JSON(http.StatusOK, gin.H{
		"ok":           true,
		"message":      "Service demo request success",
		"service_data": &serviceData,
	})
}

func parseMap(aMap map[string]interface{}, thumbnails *[]string) {
    for key, val := range aMap {
        switch concreteVal := val.(type) {
        case map[string]interface{}:
            fmt.Println(key)
			if key == "bounding_box" {
				var bbox models.BoundingBox
				err := mapstructure.Decode(val, &bbox)
				if err != nil {
					log.Fatal("Failed to decode bounding_box, err=", err)
				}
				fmt.Println("found", bbox)
			}
            parseMap(val.(map[string]interface{}), thumbnails)
        case []interface{}:
            fmt.Println(key)
            parseArray(val.([]interface{}), thumbnails)
        default:
            fmt.Println(key, ":", concreteVal)
        }
    }
}

func parseArray(anArray []interface{}, thumbnails *[]string) {
    for i, val := range anArray {
        switch concreteVal := val.(type) {
        case map[string]interface{}:
            fmt.Println("Index:", i)
            parseMap(val.(map[string]interface{}), thumbnails)
        case []interface{}:
            fmt.Println("Index:", i)
            parseArray(val.([]interface{}), thumbnails)
        default:
            fmt.Println("Index", i, ":", concreteVal)
        }
    }
}