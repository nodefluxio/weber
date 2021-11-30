package controllers

import (
	"backend/models"
	"bytes"
	"encoding/json"
	"fmt"

	"net/http"
	"os"

	log "github.com/sirupsen/logrus"
)

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
			"BASE_URL": BASE_URL,
			"slug":     innovationSlug,
			"Method":   "POST",
		}).Fatal("Fatal on send http new request!")
	}

	request.Header.Set("Content-Type", "application/json")

	var client = &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		log.WithFields(log.Fields{
			"error":   err,
			"data":    data,
			"request": request,
		}).Error("Error on request to innovation!")
		return data, err
	}

	defer response.Body.Close()

	err = json.NewDecoder(response.Body).Decode(&data)
	if err != nil {
		log.WithFields(log.Fields{
			"error":         err,
			"data":          data,
			"response_body": response.Body,
		}).Error("Error request to innovation sync!")
		return data, err
	}

	return data, nil
}
