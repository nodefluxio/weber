package controllers

import (
	"backend/models"
	"backend/utils"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/tidwall/gjson"
)

func (ctrl *Controller) CreateFacePaymentAccount(ctx *gin.Context) {
	var newAccountData models.NewAccountData
	ctx.BindJSON(&newAccountData)

	sessionId := newAccountData.SessionID
	phone := newAccountData.Phone
	inputDataToAnalytic := newAccountData.Data

	// Check if session is not exist in our record
	if !ctrl.IsSessionExist(sessionId) {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"ok":      false,
			"message": "Session ID is not valid",
		})
		return
	}

	// Check if session has expired
	if ctrl.IsSessionExpired(sessionId) {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"ok":      false,
			"message": "Session ID has expired",
		})
		return
	}

	// Condition to validate new account data and phone input
	// on first hit from frontend
	if len(inputDataToAnalytic.Images) < 1 {
		// Validate the inputs
		err := utils.Validate.Struct(newAccountData)
		errs := utils.TranslateError(err)
		if len(errs) > 0 {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"ok":      false,
				"message": errs[0].Error(),
			})
			return
		}

		// Validate the phone input must be a positive number
		if isPositive := isPositiveNumber(phone); !isPositive {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"ok":      false,
				"message": "phone must be a valid positive numeric value",
			})
			return
		}

		// Validate that the phone number does not exist in the db
		if phoneExist := ctrl.isPhoneAlreadyExists(phone); phoneExist {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"ok":      false,
				"message": "phone number already exist, try to use another number",
			})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"ok":      true,
			"message": "Phone number is valid",
		})
		return
	}

	var service models.Service
	models.GetServiceBySlug(ctrl.dbConn, &service, "face-payment")

	// Make a request to analytic Face Liveness
	// with inputted image
	resultFaceLiveness, err := GetResultFaceLiveness(service, inputDataToAnalytic)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	// Validate the liveness result status must be true before enrollment
	resultFaceLivenessJson, _ := json.Marshal(resultFaceLiveness)
	isLive := gjson.Get(string(resultFaceLivenessJson), "job.result.result.0.face_liveness.live").Bool()
	if !isLive {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"ok":      false,
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
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	// Insert new account data into db
	var newAccount models.FacePaymentAccount
	newAccount.SessionID = sessionId
	newAccount.FullName = newAccountData.FullName
	newAccount.Phone = newAccountData.Phone
	newAccount.HaveTwin = *newAccountData.HaveTwin
	newAccount.CreatedAt = time.Now()
	newAccount.UpdatedAt = newAccount.CreatedAt

	err = models.CreateAccount(ctrl.dbConn, &newAccount)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"ok":      true,
		"message": "Face payment account registration has been successful",
	})
}

func (ctrl *Controller) isPhoneAlreadyExists(phone string) bool {
	var account models.FacePaymentAccount

	if isExist := ctrl.dbConn.Where("phone = ?", phone).First(&account).RowsAffected; isExist > 0 {
		return true
	}

	return false
}

func (ctrl *Controller) UpdateFacePaymentAccount(ctx *gin.Context) {
	var accountActivationData models.AccountActivationData
	ctx.BindJSON(&accountActivationData)

	sessionId := accountActivationData.SessionID
	pin := accountActivationData.Pin

	// Check if session is not exist in our record
	if !ctrl.IsSessionExist(sessionId) {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"ok":      false,
			"message": "Session ID is not valid",
		})
		return
	}

	// Check if session has expired
	if ctrl.IsSessionExpired(sessionId) {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"ok":      false,
			"message": "Session ID has expired",
		})
		return
	}

	// Validate the inputs
	err := utils.Validate.Struct(accountActivationData)
	errs := utils.TranslateError(err)
	if len(errs) > 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"ok":      false,
			"message": errs[0].Error(),
		})
		return
	}

	// Validate the pin input must be a valid numeric value
	// and positive
	if isPositive := isPositiveNumber(pin); !isPositive {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"ok":      false,
			"message": "pin must be a valid positive numeric value",
		})
		return
	}

	// Update account data in db
	var newAccount models.FacePaymentAccount

	newAccount.SessionID = sessionId
	newAccount.Pin = accountActivationData.Pin
	newAccount.MinimumPayment = accountActivationData.MinimumPayment
	newAccount.UpdatedAt = time.Now()

	err = models.ActivateAccount(ctrl.dbConn, &newAccount)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	// Creating the new account's wallet
	var newAccountWallet models.FacePaymentWallet
	err = models.CreateAccountWallet(ctrl.dbConn, sessionId, &newAccount, &newAccountWallet)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"ok":      true,
		"message": "Account activated successfully",
	})
}

func isPositiveNumber(number string) bool {
	if num, _ := strconv.Atoi(number); num <= 0 {
		return false
	}

	return true
}
