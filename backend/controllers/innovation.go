package controllers

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"os"
)

func RequestToInnovationSync(postBody []byte, innovationSlug string) (map[string]interface{}, error) {
	var err error
	var request *http.Request
	var data map[string]interface{}

	payload := bytes.NewBuffer(postBody)

	if innovationSlug == "ocr-receipt" {
		request, err = http.NewRequest("POST", os.Getenv("URL_OCR_RECEIPT"), payload)
	} // add new condition for new innovation here

	if err != nil {
		log.Fatal(err)
	}

	request.Header.Set("Content-Type", "application/json")

	var client = &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		log.Println(err)
		return data, err
	}

	defer response.Body.Close()

	err = json.NewDecoder(response.Body).Decode(&data)
	if err != nil {
		log.Println(err)
		return data, err
	}

	return data, nil
}