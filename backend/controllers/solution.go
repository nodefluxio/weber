package controllers

import (
	"backend/models"
	"errors"
	"log"
)

func implementEKYCSolution(service models.Service, inputData models.ServiceRequestInput) (models.ServiceRequestResultData, error) {
	// Define 3 analytics in EKYC Solution
	analyticNames := [3]string{"face-liveness", "ocr-ktp", "face-match"}

	// Search by analytic-name and reuse analytics method
	for i := 0; i < len(analyticNames); i++ {
		if inputData.AnalyticName == analyticNames[i] {
			dataAnalytic := GetDataAnalytic(service, inputData)
			return RequestToAnalyticSync(dataAnalytic, inputData.AnalyticName)
		}
	}

	var data models.ServiceRequestResultData
	err := errors.New("Analytic of slug: " + service.Slug + "is not found.")
	log.Fatal(err)
	return data, err
}
