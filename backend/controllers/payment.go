package controllers

import (
	"backend/models"
	"backend/utils"
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

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

	ctrl.Model.GetAccount(&FacePaymentAccount, SessionID)

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

func (ctrl *Controller) Payment(ctx *gin.Context) {
	var payment models.Payment
	var fpaccount models.FacePaymentAccount
	ctx.BindJSON(&payment)

	sessionId := payment.SessionID
	pin := payment.Pin
	phone := payment.Phone
	amount := payment.Amount
	var newBalance int

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

	err := utils.Validate.Struct(payment)
	errs := utils.TranslateError(err)
	if len(errs) > 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"ok":      false,
			"message": errs[0].Error(),
		})
		return
	}

	//Check Pin
	if err := ctrl.DBConn.Where("pin = ?", pin).First(&fpaccount).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Wrong Pin!", "ok": false})
		return
	}

	phone = ctrl.reformatPhone(phone, sessionId)

	//Check phone number
	if phone != fpaccount.Phone {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Phone not found", "ok": false})
		return
	}
	//Check Amount
	if amount > fpaccount.MinimumPayment {
		ctx.JSON(http.StatusNotFound, gin.H{
			"message": "Your balance is Not Enough!",
			"ok":      false,
		})
		return
	} else {
		newBalance = fpaccount.MinimumPayment - payment.Amount
	}

	//update balance
	var updateAccount models.FacePaymentAccount

	updateAccount.SessionID = sessionId
	updateAccount.MinimumPayment = newBalance
	updateAccount.UpdatedAt = time.Now()

	err = ctrl.Model.UpdateBalance(&updateAccount)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	//Create Transaction
	var newTransaction models.FacePaymentTransaction
	newTransaction.Amount = amount
	newTransaction.CreatedAt = time.Now()

	err = ctrl.Model.CreateTransactionDb(sessionId, &updateAccount, &newTransaction)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"ok":      false,
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Payment transaction success", "ok": true})
}

func (ctrl *Controller) CheckSessionId(ctx *gin.Context) {
	var facePayments models.FacePaymentAccount
	var CheckSessionResult models.CheckSessionResult
	sessionId := ctx.Param("session_id")

	if err := ctrl.DBConn.Model(facePayments).First(&facePayments, "session_id = ?", sessionId).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{
				"ok":      false,
				"message": "Session Id not found",
			})
			return
		}
	}

	CheckSessionResult.IsActive = facePayments.IsActive
	if facePayments.ID != 0 {
		CheckSessionResult.IsRegistered = true
	} else {
		CheckSessionResult.IsRegistered = false
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":    &CheckSessionResult,
		"message": "Session ID Checked",
		"ok":      false,
	})
}
