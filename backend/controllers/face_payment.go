package controllers

import (
	"backend/database"
	"backend/models"
	"backend/utils"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/tidwall/gjson"
)

func CreateFacePaymentAccount(ctx *gin.Context) {
	var newAccountData models.NewAccountData
	ctx.BindJSON(&newAccountData)

	sessionId := newAccountData.SessionID
	phone := newAccountData.Phone
	inputDataToAnalytic := newAccountData.Data
	
	// Check if session is not exist in our record
	if !utils.IsSessionExist(sessionId) {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"ok": false,
			"message": "Session ID is not valid",
		})
		return
	}

	// Check if session has expired
	if utils.IsSessionExpired(sessionId) {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"ok": false,
			"message": "Session ID has expired",
		})
		return
	}

	// Condition to validate phone input on first hit from frontend
	if len(inputDataToAnalytic.Images) < 1 {		
		// Validate the phone input must be a valid numeric value
		// and positive 
		if isNumeric := isPhoneValueNumeric(phone); !isNumeric {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"ok": false,
				"message": "Phone number must be a valid positive numeric value",
			})
			return
		}

		// Validate that the phone number does not exist in the db
		if phoneExist := isPhoneAlreadyExists(phone); phoneExist {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"ok": false,
				"message": "Phone number already exist, try to use another number",
			})
			return
		}
		
		ctx.JSON(http.StatusOK, gin.H{
			"ok": true,
			"message": "Phone number is valid",
		})
		return
	}

	var service models.Service
	db := database.GetDB()
	models.GetServiceBySlug(db, &service, "face-payment")

	// Make a request to analytic Face Liveness
	// with inputted image
	resultFaceLiveness, err := GetResultFaceLiveness(service, inputDataToAnalytic)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok": false,
			"message": err.Error(),
		})
		return
	}

	// Validate the liveness result status must be true before enrollment
	resultFaceLivenessJson, _ := json.Marshal(resultFaceLiveness) 
	isLive := gjson.Get(string(resultFaceLivenessJson), "job.result.result.0.face_liveness.live").Bool()
	if !isLive {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"ok": false,
			"message": "Liveness result for the inputted image is false",
		})
		return
	}

	// Make a request to analytic Face Enrollment
	// with inputted image
	inputDataToAnalytic.AdditionalParams = map[string]interface{}{"face_id": phone}
	_, err = GetResultFaceEnrollment(service, inputDataToAnalytic)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok": false,
			"message": err.Error(),
		})
		return
	}

	// Insert new account data into db
	var newAccount models.FacePaymentAccount
	newAccount.SessionID = sessionId
	newAccount.FullName = newAccountData.FullName
	newAccount.Phone = newAccountData.Phone
	newAccount.HaveTwin = newAccountData.HaveTwin
	newAccount.CreatedAt = time.Now()
	newAccount.UpdatedAt = newAccount.CreatedAt

	err = models.CreateAccount(db, &newAccount)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok": false,
			"message": err.Error(), 
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"ok": true,
		"message": "Face payment account registration has been successful",
	})
}

func isPhoneValueNumeric(phone string) bool {
	if num, err := strconv.Atoi(phone); num <= 0 || err != nil {
		return false
	}

	return true
}

func isPhoneAlreadyExists(phone string) bool {
	var account models.FacePaymentAccount
	db := database.GetDB()
	
	if isExist := db.Where("phone = ?", phone).First(&account).RowsAffected; isExist > 0 {
		return true
	}
	
	return false
}