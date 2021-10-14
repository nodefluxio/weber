package controllers

import (
	"backend/database"
	"backend/models"
	"backend/utils"
	"bytes"
	"io/ioutil"
	"log"
	"net/http"
	"encoding/json"
    "fmt"

)

func RequestToService(serviceId int, inputData models.ServiceRequestInput){

	idJob string

	db := database.GetDB()
	
	apiService := &models.APIService{}

	postBody, _ := json.Marshal(map[string]string{
		"additional_params" : inputData.Data.AdditionalParams,
		"images" : inputData.Data.Images,
	})

	db.Model(service).First(&apiService, "id = ?", serviceId)

	if apiService.slug = "ocr-ktp"{
		idJob := Ocr(postBody)
		GetID(idJob)
	} else if apiService.slug = "licence-plate-recognition"{
		idJob := Lpr(postBody)
		GetID(idJob)
	} else if apiService.slug = "face-match-enrollment"{
		idJob := FaceMatchEnroll(postBody)
		GetID(idJob)
	} else if apiService.slug = "face-recognition"{
		idJob := FaceRecognise(postBody)
		GetID(idJob)
	}
		
}

func GetID(jobId){

	url := fmt.Sprintf("https://api.cloud.nodeflux.io/v1/jobs/%s", jobId)

	response, err := http.NewRequest("GET", url)
	if err != nil {
		log.Fatal(err)
	}

	response.Header.Set("Authorization",os.Getenv("Authorization"))
	response.Header.Set("x-nodeflux-timestamp",os.Getenv("x-nodeflux-timestamp"))

	defer response.Body.Close()

	data,_:=ioutil.ReadAll(response.Body)

	fmt.Println(string(data))

}

func Ocr(postBody map[string]interface{}){

	var result models.ServiceRequestResultData

	response, err := http.NewRequest("POST", "https://api.cloud.nodeflux.io/v1/analytics/ocr-ktp", bytes.NewBuffer(postBody))
	if err != nil {
		log.Fatal(err)
	}

	//Set Header
	response.Header.Set("Authorization",os.Getenv("Authorization"))
	response.Header.Set("x-nodeflux-timestamp",os.Getenv("x-nodeflux-timestamp"))
	
	defer response.Body.Close()

	data,_:=ioutil.ReadAll(response.Body)

	json.Unmarshal([]byte(data), &result)

	return result.Job

	//fmt.Println(string(data))

}

func Lpr(postBody map[string]interface{}){

	var result models.ServiceRequestResultData
	"https://api.cloud.nodeflux.io/v1/analytics/license-plate-recognition"

	response, err := http.NewRequest("POST", "https://api.cloud.nodeflux.io/v1/analytics/license-plate-recognition", bytes.NewBuffer(postBody))
	if err != nil {
		log.Fatal(err)
	}

	//Set Header
	response.Header.Set("Authorization",os.Getenv("Authorization"))
	response.Header.Set("x-nodeflux-timestamp",os.Getenv("x-nodeflux-timestamp"))

	defer response.Body.Close()

	data,_:=ioutil.ReadAll(response.Body)

	json.Unmarshal([]byte(data), &result)

	return result.Job

	//fmt.Println(string(data))

}

func FaceRecognise(postBody map[string]interface{}){

	var result models.ServiceRequestResultData
	
	response, err := http.NewRequest("POST", "https://api.cloud.nodeflux.io/v1/analytics/face-recognition", bytes.NewBuffer(postBody))
	if err != nil {
		log.Fatal(err)
	}

	//Set Header
	response.Header.Set("Authorization",os.Getenv("Authorization"))
	response.Header.Set("x-nodeflux-timestamp",os.Getenv("x-nodeflux-timestamp"))
	
	defer response.Body.Close()

	data,_:=ioutil.ReadAll(response.Body)

	json.Unmarshal([]byte(data), &result)

	return result.Job

	//fmt.Println(string(data))

}

func FaceMatchEnroll(postBody map[string]interface{}){

	var result models.ServiceRequestResultData

	response, err := http.NewRequest("POST", "https://api.cloud.nodeflux.io/v1/analytics/face-match-enrollment", bytes.NewBuffer(postBody))
	if err != nil {
		log.Fatal(err)
	}

	//Set Header
	response.Header.Set("Authorization",os.Getenv("Authorization"))
	response.Header.Set("x-nodeflux-timestamp",os.Getenv("x-nodeflux-timestamp"))
	
	defer response.Body.Close()

	data,_:=ioutil.ReadAll(response.Body)

	json.Unmarshal([]byte(data), &result)

	return result.Job

	//fmt.Println(string(data))

}