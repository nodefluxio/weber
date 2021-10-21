package controllers

import (
	"backend/database"
	"backend/models"
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

var (
	accessKey     string
	timestamp     string
	token         string
	authorization string
	date          string
)

func RequestToService(serviceId int, inputData models.ServiceRequestInput) (models.ServiceRequestResultData, error) {
	db := database.GetDB()
	var service models.Service
	var data models.ServiceRequestResultData
	var err error

	if err = db.First(&service, serviceId).Error; err != nil {
		return data, err
	}

	postBody := []byte(fmt.Sprintf(`{ "additional_params": {"face_id": "%v"}, "images":  [ "%v" ]}`,
		os.Getenv("FACE_ID"), strings.Join(inputData.Data.Images, `", "`)))

	accessKey = service.AccessKey
	timestamp = service.Timestamp
	token = service.Token
	date = timestamp[:8]
	authorization = fmt.Sprintf("NODEFLUX-HMAC-SHA256 Credential=%s/%s/nodeflux.api.v1beta1.ImageAnalytic/StreamImageAnalytic, "+
		"SignedHeaders=x-nodeflux-timestamp, Signature=%s", accessKey, date, token)

	var jobId string
	switch service.Type {
	case "analytic":
		jobId, _ = requestToAnalytic(postBody, service.Slug)
	// TODO: Add new cases for Solution and Innovation type.
	}

	for i := 1; i <= 5; i++ {
		data, err = getJobStatus(jobId)
		if data.Job.Result["status"] == "success" {
			break
		}

		time.Sleep(1 * time.Second)
	}

	if err != nil {
		return data, err
	}

	return data, nil
}

func getJobStatus(jobId string) (models.ServiceRequestResultData, error) {
	url := fmt.Sprintf("https://api.cloud.nodeflux.io/v1/jobs/%s", jobId)
	var data models.ServiceRequestResultData

	request, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return data, err
	}
	
	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Authorization", authorization)
	request.Header.Set("x-nodeflux-timestamp", timestamp)

	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return data, err
	}

	defer response.Body.Close()

	err = json.NewDecoder(response.Body).Decode(&data)
	if err != nil {
		return data, err
	}

	return data, err
}

func requestToAnalytic(postBody []byte, analyticSlug string) (string, error) {
	payload := bytes.NewBuffer(postBody)
	request, err := http.NewRequest("POST", os.Getenv("URL_ANALYTICS")+analyticSlug, payload)
	if err != nil {
		log.Fatal(err)
	}

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Authorization", authorization)
	request.Header.Set("x-nodeflux-timestamp", timestamp)

	var client = &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return "", err
	}

	defer response.Body.Close()

	var data models.ResponseResultData
	err = json.NewDecoder(response.Body).Decode(&data)
	if err != nil {
		return "", err
	}

	return data.Job.ID, nil
}