package controllers

import (
	"backend/models"
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"image"
	_ "image/jpeg"
	"image/png"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/oliamb/cutter"
	log "github.com/sirupsen/logrus"
)

type dataAnalytic struct {
	postBody           []byte
	authorization      string
	xNodefluxTimestamp string
}

func GetDataAnalytic(service models.Service, requestData models.RequestData) dataAnalytic {
	var dataAnalytic dataAnalytic
	dataAnalytic.xNodefluxTimestamp = service.Timestamp

	additionalParams, _ := json.Marshal(requestData.AdditionalParams)
	dataAnalytic.postBody = []byte(fmt.Sprintf(`{ "additional_params": %v , "images":  [ "%v" ]}`,
		string(additionalParams), strings.Join(requestData.Images, `", "`)))
	accessKey := service.AccessKey
	token := service.Token
	date := dataAnalytic.xNodefluxTimestamp[:8]
	dataAnalytic.authorization = fmt.Sprintf("NODEFLUX-HMAC-SHA256 Credential=%s/%s/nodeflux.api.v1beta1.ImageAnalytic/StreamImageAnalytic, "+
		"SignedHeaders=x-nodeflux-timestamp, Signature=%s", accessKey, date, token)

	return dataAnalytic
}

func RequestToAnalyticSync(dataAnalytic dataAnalytic, analyticSlug string) (models.ServiceRequestResultData, error) {
	var data models.ServiceRequestResultData

	log.WithFields(log.Fields{
		"data": dataAnalytic,
		"slug": analyticSlug,
	}).Info("[CONTROLLER: RequestToAnalyticSync] request to analytics sync start...")

	payload := bytes.NewBuffer(dataAnalytic.postBody)
	request, err := http.NewRequest("POST", os.Getenv("URL_ANALYTICS")+analyticSlug, payload)
	if err != nil {
		log.WithFields(log.Fields{
			"error":  err,
			"slug":   analyticSlug,
			"method": "POST",
		}).Error("[CONTROLLER: RequestToAnalyticSync] error on send http new request to analytic!")

	}

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Authorization", dataAnalytic.authorization)
	request.Header.Set("x-nodeflux-timestamp", dataAnalytic.xNodefluxTimestamp)

	var client = &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		log.WithFields(log.Fields{
			"error":   err,
			"request": request,
		}).Error("[CONTROLLER: RequestToAnalyticSync] error on request to analytic!")
		return data, err
	}

	defer response.Body.Close()

	var dataResponse models.ResponseResultData
	err = json.NewDecoder(response.Body).Decode(&dataResponse)
	if err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"data":  dataResponse,
		}).Error("[CONTROLLER: RequestToAnalyticSync] error on decode response body!")
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

	log.WithFields(log.Fields{
		"data": dataResponse,
	}).Info("[CONTROLLER: RequestToAnalyticSync] request to analytics sync successfully done")

	return data, nil
}

func getJobStatus(dataAnalytic dataAnalytic, jobId string) (models.ServiceRequestResultData, error) {
	url := fmt.Sprintf("https://api.cloud.nodeflux.io/v1/jobs/%s", jobId)
	var data models.ServiceRequestResultData

	log.WithFields(log.Fields{
		"url":    url,
		"job_id": jobId,
		"data":   dataAnalytic,
	}).Info("[CONTROLLER: getJobStatus] get job status start...")

	request, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.WithFields(log.Fields{
			"error":  err,
			"url":    url,
			"method": "GET",
		}).Error("[CONTROLLER: getJobStatus] error on http new request to url!")
		return data, err
	}

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Authorization", dataAnalytic.authorization)
	request.Header.Set("x-nodeflux-timestamp", dataAnalytic.xNodefluxTimestamp)

	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		log.WithFields(log.Fields{
			"error":   err,
			"request": request,
		}).Error("[CONTROLLER: getJobStatus] error on client request!")

		return data, err
	}

	defer response.Body.Close()

	err = json.NewDecoder(response.Body).Decode(&data)
	if err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"data":  data,
		}).Error("[CONTROLLER: getJobStatus] error on decode response body!")

		return data, err
	}

	log.WithFields(log.Fields{
		"url":    url,
		"data":   data,
		"job_id": jobId,
	}).Info("[CONTROLLER: getJobStatus] get job status successfully done")

	return data, err
}

func GetResultFaceLiveness(service models.Service, input models.RequestData) (models.ServiceRequestResultData, error) {
	var result models.ServiceRequestResultData
	dataAnalytic := GetDataAnalytic(service, input)

	log.WithFields(log.Fields{
		"additional_params": input.AdditionalParams,
		"total_images":      len(input.Images),
		"data":              dataAnalytic,
		"service":           service,
	}).Info("[CONTROLLER: GetResultFaceLiveness] get result face liveness start...")

	result, err := RequestToAnalyticSync(dataAnalytic, "face-liveness")
	if err != nil {
		log.WithFields(log.Fields{
			"error":  err,
			"data":   dataAnalytic,
			"result": result,
			"slug":   "face-liveness",
		}).Error("[CONTROLLER: GetResultFaceLiveness] error on request to analytic face liveness!")

		fmt.Println("Error during fetching API face liveness: ", err)
		return result, err
	}

	log.WithFields(log.Fields{
		"result": result,
	}).Info("[CONTROLLER: GetResultFaceLiveness] get result face liveness successfully done")

	return result, nil
}

func GetResultOCRKTP(service models.Service, input models.RequestData) (models.ServiceRequestResultData, error) {
	var result models.ServiceRequestResultData
	dataAnalytic := GetDataAnalytic(service, input)

	log.WithFields(log.Fields{
		"additional_params": input.AdditionalParams,
		"total_images":      len(input.Images),
		"data":              dataAnalytic,
		"service":           service,
	}).Info("[CONTROLLER: GetResultOCRKTP] get result ocr ktp start...")

	result, err := RequestToAnalyticSync(dataAnalytic, "ocr-ktp")
	if err != nil {
		log.WithFields(log.Fields{
			"error":  err,
			"data":   dataAnalytic,
			"result": result,
			"slug":   "ocr-ktp",
		}).Error("[CONTROLLER: GetResultOCRKTP] error on request to analytic ocr ktp!")

		fmt.Println("Error during fetching API ocr ktp: ", err)
		return result, err
	}

	log.WithFields(log.Fields{
		"result": result,
	}).Info("[CONTROLLER: GetResultOCRKTP] get result ocr ktp successfully done")

	return result, nil
}

func GetResultFaceMatch(service models.Service, input models.RequestData) (models.ServiceRequestResultData, error) {
	var result models.ServiceRequestResultData
	dataAnalytic := GetDataAnalytic(service, input)

	log.WithFields(log.Fields{
		"additional_params": input.AdditionalParams,
		"total_images":      len(input.Images),
		"data":              dataAnalytic,
		"service":           service,
	}).Info("[CONTROLLER: GetResultFaceMatch] get result face match start...")

	result, err := RequestToAnalyticSync(dataAnalytic, "face-match")
	if err != nil {
		log.WithFields(log.Fields{
			"error":  err,
			"data":   dataAnalytic,
			"result": result,
			"slug":   "face-match",
		}).Error("[CONTROLLER: GetResultFaceMatch] error on request to analytic face match!")

		fmt.Println("Error during fetching API face match: ", err)
		return result, err
	}

	log.WithFields(log.Fields{
		"result": result,
	}).Info("[CONTROLLER: GetResultFaceMatch] get result face match successfully done")

	return result, nil
}

func GetResultFaceEnrollment(service models.Service, input models.RequestData) (models.ServiceRequestResultData, error) {
	var result models.ServiceRequestResultData
	dataAnalytic := GetDataAnalytic(service, input)

	log.WithFields(log.Fields{
		"additional_params": input.AdditionalParams,
		"total_images":      len(input.Images),
		"data":              dataAnalytic,
		"service":           service,
	}).Info("[CONTROLLER: GetResultFaceEnrollment] get result face enrollment start...")

	result, err := RequestToAnalyticSync(dataAnalytic, "create-face-enrollment")

	if err != nil {
		log.WithFields(log.Fields{
			"error":  err,
			"data":   dataAnalytic,
			"result": result,
			"slug":   "create-face-enrollment",
		}).Error("[CONTROLLER: GetResultFaceEnrollment] error on request to analytic create face enrollment!")

		fmt.Println("Error during fetching API face enrollment: ", err)
		return result, err
	}

	log.WithFields(log.Fields{
		"result": result,
	}).Info("[CONTROLLER: GetResultFaceEnrollment] get result face enrollment successfully done")

	return result, nil
}

func GetResultFaceMatchEnrollment(service models.Service, input models.RequestData) (models.ServiceRequestResultData, error) {
	var result models.ServiceRequestResultData
	dataAnalytic := GetDataAnalytic(service, input)

	log.WithFields(log.Fields{
		"additional_params": input.AdditionalParams,
		"total_images":      len(input.Images),
		"data":              dataAnalytic,
		"service":           service,
	}).Info("[CONTROLLER: GetResultFaceMatchEnrollment] get result face match enrollment start...")

	result, err := RequestToAnalyticSync(dataAnalytic, "face-match-enrollment")
	if err != nil {
		log.WithFields(log.Fields{
			"error":  err,
			"data":   dataAnalytic,
			"result": result,
			"slug":   "face-match-enrollment",
		}).Error("[CONTROLLER: GetResultFaceMatchEnrollment] error on request to analytic face match enrollment!")

		fmt.Println("Error during fetching API face match with enrollment: ", err)
		return result, err
	}

	log.WithFields(log.Fields{
		"result": result,
	}).Info("[CONTROLLER: GetResultFaceMatchEnrollment] get result face match enrollment successfully done")

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
	err = png.Encode(&buf, croppedImg)
	if err != nil {
		log.Println("Failed to encode to PNG, err=", err)
		return "", "", err
	}

	id := fmt.Sprintf("%v", bbox)
	b64str := "data:image/png;base64," + base64.StdEncoding.EncodeToString(buf.Bytes())

	return b64str, id, err
}
