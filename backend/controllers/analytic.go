package controllers

import (
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

type dataAnalytic struct {
	postBody           []byte
	authorization      string
	xNodefluxTimestamp string
}

func GetDataAnalytic(service models.Service, requestData models.RequestData) dataAnalytic {
	var dataAnalytic dataAnalytic
	dataAnalytic.xNodefluxTimestamp = service.Timestamp

	if service.Slug == "face-match-enrollment" {
		dataAnalytic.postBody = []byte(fmt.Sprintf(`{ "additional_params": {"face_id": "%v"}, "images":  [ "%v" ]}`,
			os.Getenv("FACE_ID"), strings.Join(requestData.Images, `", "`)))
	} else if service.Slug == "create-face-enrollment"{
		dataAnalytic.postBody = []byte(fmt.Sprintf(`{ "additional_params": {"face_id": "%v"}, "images":  [ "%v" ]}`,
			requestData.AdditionalParams["face_id"], strings.Join(requestData.Images, `", "`)))
	} else {
		additionalParams, _ := json.Marshal(requestData.AdditionalParams)
		dataAnalytic.postBody = []byte(fmt.Sprintf(`{ "additional_params": %v , "images":  [ "%v" ]}`,
			string(additionalParams), strings.Join(requestData.Images, `", "`)))
	}

	accessKey := service.AccessKey
	token := service.Token
	date := dataAnalytic.xNodefluxTimestamp[:8]
	dataAnalytic.authorization = fmt.Sprintf("NODEFLUX-HMAC-SHA256 Credential=%s/%s/nodeflux.api.v1beta1.ImageAnalytic/StreamImageAnalytic, "+
		"SignedHeaders=x-nodeflux-timestamp, Signature=%s", accessKey, date, token)

	return dataAnalytic
}

func RequestToAnalyticSync(dataAnalytic dataAnalytic, analyticSlug string) (models.ServiceRequestResultData, error) {
	var data models.ServiceRequestResultData

	payload := bytes.NewBuffer(dataAnalytic.postBody)
	request, err := http.NewRequest("POST", os.Getenv("URL_ANALYTICS")+analyticSlug, payload)
	if err != nil {
		log.Fatal(err)
	}

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Authorization", dataAnalytic.authorization)
	request.Header.Set("x-nodeflux-timestamp", dataAnalytic.xNodefluxTimestamp)

	var client = &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return data, err
	}

	defer response.Body.Close()

	var dataResponse models.ResponseResultData
	err = json.NewDecoder(response.Body).Decode(&dataResponse)
	if err != nil {
		return data, err
	}

	jobId := dataResponse.Job.ID
	for i := 1; i <= 10; i++ {
		data, err = getJobStatus(dataAnalytic, jobId)
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

func getJobStatus(dataAnalytic dataAnalytic, jobId string) (models.ServiceRequestResultData, error) {
	url := fmt.Sprintf("https://api.cloud.nodeflux.io/v1/jobs/%s", jobId)
	var data models.ServiceRequestResultData

	request, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return data, err
	}

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Authorization", dataAnalytic.authorization)
	request.Header.Set("x-nodeflux-timestamp", dataAnalytic.xNodefluxTimestamp)

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

func GetResultFaceLiveness(service models.Service, input models.RequestData) (models.ServiceRequestResultData, error) {
	var result models.ServiceRequestResultData
	dataAnalytic := GetDataAnalytic(service, input)
	result, err := RequestToAnalyticSync(dataAnalytic, "face-liveness")
	if err != nil {
		fmt.Println("Error during fetching API face liveness: ", err)
		return result, err
	}
	return result, nil
}

func GetResultFaceEnrollment(service models.Service, input models.RequestData) (models.ServiceRequestResultData, error) {
	var result models.ServiceRequestResultData
	dataAnalytic := GetDataAnalytic(service, input)
	result, err := RequestToAnalyticSync(dataAnalytic, "create-face-enrollment")

	if err != nil {
		fmt.Println("Error during fetching API face enrollment: ", err)
		return result, err
	}
	return result, nil
}