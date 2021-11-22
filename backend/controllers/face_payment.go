package controllers

import (
	"backend/models"
	"backend/utils"
	"encoding/json"
	"errors"
	"net/http"
	"regexp"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/tidwall/gjson"
	"gorm.io/gorm"
)

func (ctrl *Controller) GetActiveAccountBySessionID(ctx *gin.Context) {
	sessionId := ctx.Param("session_id")

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

	var account models.FacePaymentAccount
	err := ctrl.Model.GetActiveAccount(&account, sessionId)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		ctx.JSON(http.StatusNotFound, gin.H{
			"ok":      false,
			"message": "This session id does not have an active face payment account",
		})
		return
	}

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	var accountWallet models.FacePaymentWallet
	ctrl.Model.GetAccountWallet(&accountWallet, account.ID)

	var accountResultData models.AccountResultData
	accountResultData.HaveTwin = account.HaveTwin
	accountResultData.FullName = account.FullName
	accountResultData.MinimumPayment = account.MinimumPayment
	accountResultData.Balance = accountWallet.Balance

	// Decode the phone number from database using regex
	prefixPhone := ctrl.getPrefixPhone(sessionId)
	re := regexp.MustCompile(`(?m)^` + prefixPhone + `(\S+)`)
	matchingGroups := re.FindStringSubmatch(account.Phone)
	accountResultData.Phone = matchingGroups[1]

	ctx.JSON(http.StatusOK, gin.H{
		"data":    accountResultData,
		"ok":      true,
		"message": "This session id has an active face payment account",
	})
}

func (ctrl *Controller) CreateFacePaymentAccount(ctx *gin.Context) {
	var newAccountData models.NewAccountData
	ctx.BindJSON(&newAccountData)

	sessionId := newAccountData.SessionID
	phone := newAccountData.Phone
	phoneFormatted := ctrl.reformatPhone(phone, sessionId)
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
		if isPositive := isPositiveNumber(phoneFormatted); !isPositive {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"ok":      false,
				"message": "phone must be a valid positive numeric value",
			})
			return
		}

		// Validate that the phone number does not exist in the db
		if phoneExist := ctrl.isPhoneAlreadyExists(phoneFormatted); phoneExist {
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
	ctrl.Model.GetServiceBySlug(&service, "face-payment")

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
	newAccount.Phone = phoneFormatted
	newAccount.HaveTwin = *newAccountData.HaveTwin
	newAccount.CreatedAt = time.Now()
	newAccount.UpdatedAt = newAccount.CreatedAt

	err = ctrl.Model.CreateAccount(&newAccount)
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

	err = ctrl.Model.ActivateAccount(&newAccount)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	// Creating the new account's wallet
	var newAccountWallet models.FacePaymentWallet
	err = ctrl.Model.CreateAccountWallet(sessionId, &newAccountWallet)
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

func (ctrl *Controller) CreateTransaction(ctx *gin.Context) {
	var payInput models.PayInput
	var fpAccount models.FacePaymentAccount
	ctx.BindJSON(&payInput)

	sessionId := payInput.SessionID
	pin := payInput.Pin
	phone := payInput.Phone
	amount := payInput.Amount

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

	// Validate the input
	err := utils.Validate.Struct(payInput)
	errs := utils.TranslateError(err)
	if len(errs) > 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"ok":      false,
			"message": errs[0].Error(),
		})
		return
	}

	// Get the face payment account
	err = ctrl.Model.GetActiveAccount(&fpAccount, sessionId)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	// Create vars for analytic's purposes
	var service models.Service
	var inputDataToAnalytic models.RequestData
	inputDataToAnalytic.Images = payInput.Data.Images
	ctrl.Model.GetServiceBySlug(&service, "face-payment")

	// Check face liveness
	resultFaceLiveness, err := GetResultFaceLiveness(service, inputDataToAnalytic)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	resultFaceLivenessJson, _ := json.Marshal(resultFaceLiveness)
	isLive := gjson.Get(string(resultFaceLivenessJson), "job.result.result.0.face_liveness.live").Bool()
	if !isLive {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"ok":      false,
			"message": "Face payment has failed, try to get clear image and accordance with guideline.",
		})
		return
	}

	// Check face match with enrollment
	inputDataToAnalytic.AdditionalParams = map[string]interface{}{"face_id": phone}
	resultFaceMatch, err := GetResultFaceMatchEnrollment(service, inputDataToAnalytic)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}
	resultFaceMatchJson, _ := json.Marshal(resultFaceMatch)
	isMatch := gjson.Get(string(resultFaceMatchJson), "job.result.result.0.face_match.match").Bool()
	if !isMatch {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"ok":      false,
			"message": "Face payment has failed, face does not match the registered face.",
		})
		return
	}

	// If amount in the cart > minimum payment or the user have twin,
	// then require a PIN checking
	if amount >= fpAccount.MinimumPayment || fpAccount.HaveTwin {
		// Check pin
		if pin != fpAccount.Pin {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"ok":      false,
				"message": "Wrong pin!",
			})
			return
		}
	}

	// Check balance
	var fpwallet models.FacePaymentWallet
	ctrl.Model.GetAccountWallet(&fpwallet, fpAccount.ID)
	if amount > fpwallet.Balance {
		ctx.JSON(http.StatusPaymentRequired, gin.H{
			"message": "Your balance is not enough to make this transaction",
			"ok":      false,
		})
		return
	}

	// Reduce the balance
	fpwallet.Balance = fpwallet.Balance - payInput.Amount
	err = ctrl.Model.UpdateBalance(&fpwallet)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	// Create a transaction in database
	var newTransaction models.FacePaymentTransaction
	newTransaction.Amount = amount
	newTransaction.CreatedAt = time.Now()
	err = ctrl.Model.CreateTransactionDb(sessionId, &fpAccount, &newTransaction)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"ok":      true,
		"message": "Payment transaction success",
	})
}

func (ctrl *Controller) getPrefixPhone(sessionId string) string {
	// Get the DD{MM+YY} of the expired var

	expirationDate := ctrl.GetExpirationDate(sessionId)
	re := regexp.MustCompile(`(?m)(\d\d)-(\d\d)-\d\d(\d\d)`)
	matchingGroups := re.FindStringSubmatch(expirationDate)
	day := matchingGroups[1]
	monthInt, _ := strconv.Atoi(matchingGroups[2])
	yearInt, _ := strconv.Atoi(matchingGroups[3])
	sum := strconv.Itoa(monthInt + yearInt)
	prefixPhone := day + sum

	return prefixPhone
}

func (ctrl *Controller) reformatPhone(phone string, sessionId string) string {
	// Output should be: DD{MM+YY}Phone

	// Add the DD{MM+YY} of the expired var
	prefixPhone := ctrl.getPrefixPhone(sessionId)
	phone = prefixPhone + phone
	return phone
}

func (ctrl *Controller) isPhoneAlreadyExists(phone string) bool {
	var account models.FacePaymentAccount

	if isExist := ctrl.DBConn.Where("phone = ? AND is_active = ?", phone, "true").First(&account).RowsAffected; isExist > 0 {
		return true
	}

	return false
}

func isPositiveNumber(number string) bool {
	if num, _ := strconv.Atoi(number); num <= 0 {
		return false
	}

	return true
}
