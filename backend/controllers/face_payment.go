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

	phone = ctrl.reformatPhone(phone, sessionId)
	newAccountData.Phone = phone

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
	newAccount.Phone = newAccountData.Phone
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

func (ctrl *Controller) isPhoneAlreadyExists(phone string) bool {
	var account models.FacePaymentAccount

	if isExist := ctrl.DBConn.Where("phone = ? AND is_active = ?", phone, "true").First(&account).RowsAffected; isExist > 0 {
		return true
	}

	return false
}

func (ctrl *Controller) reformatPhone(phone string, sessionId string) string {
	// Output should be: DD{MM+YY}Phone

	// Replace first character with 62 if the first character is 0
	re := regexp.MustCompile(`(?m)^0`)
	phone = re.ReplaceAllString(phone, "62")

	// Add the DD{MM+YY} of the expired var
	expirationDate := ctrl.GetExpirationDate(sessionId)
	re = regexp.MustCompile(`(?m)(\d\d)-(\d\d)-\d\d(\d\d)`)
	matchingGroups := re.FindStringSubmatch(expirationDate)
	day := matchingGroups[1]
	monthInt, _ := strconv.Atoi(matchingGroups[2])
	yearInt, _ := strconv.Atoi(matchingGroups[3])
	sum := strconv.Itoa(monthInt + yearInt)
	phone = day + sum + phone

	return phone
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
	err = ctrl.Model.CreateAccountWallet(sessionId, &newAccount, &newAccountWallet)
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

func (ctrl *Controller) CheckLimit(ctx *gin.Context) {
	var CheckLimit models.CheckLimitInput
	var FacePaymentAccount models.FacePaymentAccount
	var CheckRes models.CheckLimitResult

	ctx.BindJSON(&CheckLimit)

	SessionID := CheckLimit.SessionID
	Amount := CheckLimit.Amount

	// Check if session is not exist in our record
	if !ctrl.IsSessionExist(SessionID) {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"ok":      false,
			"message": "Session ID is not valid",
		})
		return
	}

	// Check if session has expired
	if ctrl.IsSessionExpired(SessionID) {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"ok":      false,
			"message": "Session ID has expired",
		})
		return
	}

	err := utils.Validate.Struct(CheckLimit)
	errs := utils.TranslateError(err)
	if len(errs) > 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"ok":      false,
			"message": errs[0].Error(),
		})
		return
	}

	ctrl.Model.GetActiveAccount(&FacePaymentAccount, SessionID)

	CheckRes.FullName = FacePaymentAccount.FullName
	CheckRes.Balance = FacePaymentAccount.MinimumPayment

	if Amount <= CheckRes.Balance {
		CheckRes.IsLimit = false
	} else {
		CheckRes.IsLimit = true
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":    &CheckRes,
		"message": "Check Limit Minimum Payment Success",
		"ok":      false,
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

	phone = ctrl.reformatPhone(phone, sessionId)

	// Get the face payment account
	err = ctrl.Model.GetActiveAccount(&fpAccount, sessionId)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	// Check phone number
	if phone != fpAccount.Phone {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Phone is not found", "ok": false})
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
			"message": "Fake face detected. You're not authorized to use this account",
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
			"message": "Wrong face detected. You're not authorized to use this account",
		})
		return
	}

	// If amount in the cart >= minimum payment, require a PIN checking
	if amount >= fpAccount.MinimumPayment {
		// Check pin
		if pin != fpAccount.Pin {
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Wrong pin!", "ok": false})
			return
		}
	}

	// Check balance
	var fpwallet models.FacePaymentWallet
	ctrl.Model.GetAccountWallet(&fpwallet, fpAccount.ID)
	if amount > fpwallet.Balance {
		ctx.JSON(http.StatusBadRequest, gin.H{
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

	ctx.JSON(http.StatusOK, gin.H{"message": "Payment transaction success", "ok": true})
}

func (ctrl *Controller) CheckActiveAccountBySession(ctx *gin.Context) {
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
			"ok":      true,
			"message": "Active face payment account not found",
		})
		return
	}

	ctx.JSON(http.StatusFound, gin.H{
		"ok":      true,
		"message": "An active face payment account found",
	})
}
