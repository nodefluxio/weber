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
	"io"
	"encoding/base64"
	"image"
	"image/png"
	_ "image/jpeg"

	"github.com/oliamb/cutter"
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

func GetResultOCRKTP(service models.Service, input models.RequestData) (models.ServiceRequestResultData, error) {
	var result models.ServiceRequestResultData
	dataAnalytic := GetDataAnalytic(service, input)
	result, err := RequestToAnalyticSync(dataAnalytic, "ocr-ktp")
	if err != nil {
		fmt.Println("Error during fetching API ocr ktp: ", err)
		return result, err
	}
	return result, nil
}

func GetResultFaceMatch(service models.Service, input models.RequestData) (models.ServiceRequestResultData, error) {
	var result models.ServiceRequestResultData
	dataAnalytic := GetDataAnalytic(service, input)
	result, err := RequestToAnalyticSync(dataAnalytic, "face-match")
	if err != nil {
		fmt.Println("Error during fetching API face match: ", err)
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

func GetResultFaceMatchEnrollment(service models.Service, input models.RequestData) (models.ServiceRequestResultData, error) {
	var result models.ServiceRequestResultData
	dataAnalytic := GetDataAnalytic(service, input)
	result, err := RequestToAnalyticSync(dataAnalytic, "face-match-enrollment")
	if err != nil {
		fmt.Println("Error during fetching API face match with enrollment: ", err)
		return result, err
	}
	return result, nil
}

func DecodeBase64Image(base64Img string) (image.Image, image.Config, error) {
	imgData := strings.Split(base64Img, ",")[1]
	reader := base64.NewDecoder(base64.StdEncoding, strings.NewReader(imgData))
	var buf bytes.Buffer
    tee := io.TeeReader(reader, &buf)

	img, _, err := image.Decode(tee)
	if err != nil {
		return nil, image.Config{}, err
	}

	cfg, _, err := image.DecodeConfig(&buf)
	if err != nil {
		return nil, image.Config{}, err
	}
	
	return img, cfg, err
}

func CropImage(img image.Image, cfg image.Config, bbox models.BoundingBox) (string, string, error) {
	var Left int = int(bbox.Left * float64(cfg.Width))
	var Top int = int(bbox.Top * float64(cfg.Height))
	var Width int = int(bbox.Width * float64(cfg.Width))
	var Height int = int(bbox.Height * float64(cfg.Height))
	
	fmt.Println("Width:", cfg.Width, "Height:", cfg.Height)
	fmt.Println("Left:", Left, "Top:", Top, "Width:", Width, "Height:", Height)
	
	var Pad int
	var Size int
	var Fill int
	if Width > Height {
		Pad = int(0.001 * float64(cfg.Width))
		Size = Width + (2 * Pad)
		Fill = (Size - Height) / 2
		Left = Left - Pad
		Top = Top - Fill
	} else {
		Pad = int(0.001 * float64(cfg.Height))
		Size = Height + (2 * Pad)
		Fill = (Size - Width) / 2
		Left = Left - Fill
		Top = Top - Pad
	}
	
	croppedImg, err := cutter.Crop(img, cutter.Config{
		Width:  Size,
		Height: Size,
		Anchor: image.Point{Left, Top},
		Mode:   cutter.TopLeft,
	})

	var buf bytes.Buffer
	err = png.Encode(&buf, croppedImg); 
	if err != nil {
		log.Println("Failed to encode to PNG, err=", err)
		return "", "",  err
	}
	
	id := fmt.Sprintf("%v", bbox)
	b64str := "data:image/png;base64," + base64.StdEncoding.EncodeToString(buf.Bytes())
	
	return b64str, id, err
}