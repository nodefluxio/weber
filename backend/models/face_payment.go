package models

import (
	"time"

	log "github.com/sirupsen/logrus"
)

type FacePaymentAccount struct {
	ID             uint `gorm:"primaryKey; autoIncrement" json:"id"`
	SessionID      string
	Visitor        Visitor `gorm:"foreignKey:SessionID"`
	FullName       string
	Phone          string
	Pin            string
	MinimumPayment int  `gorm:"default:50000"`
	HaveTwin       bool `gorm:"default:false"`
	IsActive       bool `gorm:"default:false"`
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

type AccountResultData struct {
	FullName       string `json:"full_name"`
	Phone          string `json:"phone"`
	MinimumPayment int    `json:"minimum_payment"`
	HaveTwin       bool   `json:"have_twin"`
	Balance        int    `json:"balance"`
}

type NewAccountData struct {
	SessionID string      `json:"session_id"`
	FullName  string      `json:"full_name" validate:"required,min=2,max=255"`
	Phone     string      `json:"phone" validate:"required,numeric,min=5,max=15"`
	HaveTwin  *bool       `json:"have_twin" validate:"required"`
	Data      RequestData `json:"data"`
	CreatedAt time.Time   `json:"created_at"`
	UpdatedAt time.Time   `json:"updated_at"`
}

type AccountActivationData struct {
	SessionID      string    `json:"session_id"`
	Pin            string    `json:"pin" validate:"required,numeric,min=6,max=6"`
	MinimumPayment int       `json:"minimum_payment" validate:"required,min=50000,max=1000000"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type FacePaymentWallet struct {
	ID                 uint `gorm:"primaryKey; autoIncrement" json:"id"`
	AccountID          uint
	FacePaymentAccount FacePaymentAccount `gorm:"foreignKey:AccountID"`
	Balance            int                `gorm:"default:1000000"`
}

type FacePaymentTransaction struct {
	ID                 uint `gorm:"primaryKey; autoIncrement" json:"id"`
	AccountID          uint
	FacePaymentAccount FacePaymentAccount `gorm:"foreignKey:AccountID"`
	Amount             int
	Notes              string
	CreatedAt          time.Time
}

type PayInput struct {
	SessionID string `json:"session_id"`
	Phone     string `json:"phone" validate:"required,numeric"`
	Pin       string `json:"pin" validate:"max=6"`
	Amount    int
	Data      RequestData `json:"data"`
}

func (m *Model) CreateAccount(newAccount *FacePaymentAccount) (err error) {

	log.Info("[MODEL] create face payment account start...")

	err = m.DBConn.Select("SessionID", "FullName", "Phone", "HaveTwin", "CreatedAt", "UpdatedAt").Create(newAccount).Error
	if err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"data":  newAccount,
		}).Error("[MODEL] error on create face payment account!")
		return err
	}
	log.WithFields(log.Fields{
		"data": newAccount,
	}).Info("[MODEL] success on create face payment account")

	return nil
}

func (m *Model) ActivateAccount(newAccount *FacePaymentAccount) (err error) {
	var account *FacePaymentAccount

	// Get the last record of registered account with same session_id
	m.DBConn.Where("session_id = ? ", newAccount.SessionID).Last(&account)

	log.WithFields(log.Fields{
		"session_id": newAccount.SessionID,
	}).Info("[MODEL] activate account start...")

	// Update the last registered account's data and activate it
	err = m.DBConn.Model(&account).Updates(FacePaymentAccount{
		Pin:            newAccount.Pin,
		MinimumPayment: newAccount.MinimumPayment,
		IsActive:       true,
		UpdatedAt:      newAccount.UpdatedAt,
	},
	).Error

	if err != nil {
		log.WithFields(log.Fields{
			"error":      err,
			"data":       newAccount,
			"session_id": newAccount.SessionID,
		}).Error("[MODEL] error on activate face payment account!")

		return err
	}
	log.WithFields(log.Fields{
		"data":       newAccount,
		"session_id": newAccount.SessionID,
	}).Info("[MODEL] success on activate face payment account!")

	return nil
}

func (m *Model) CreateAccountWallet(sessionId string, newAccountWallet *FacePaymentWallet) (err error) {
	var newAccount *FacePaymentAccount

	log.WithFields(log.Fields{
		"session_id": sessionId,
		"data":       newAccountWallet,
	}).Info("[MODEL] create account wallet start...")

	err = m.DBConn.Where("session_id = ? AND is_active = ?", sessionId, "true").Last(&newAccount).Error
	if err != nil {
		log.WithFields(log.Fields{
			"error":      err,
			"data":       newAccountWallet,
			"session_id": sessionId,
			"is_active":  newAccount.IsActive,
		}).Error("[MODEL] error on find last account with session_id!")
		return err
	}

	newAccountWallet.AccountID = newAccount.ID
	err = m.DBConn.Create(newAccountWallet).Error
	if err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"data":  newAccountWallet,
		}).Error("[MODEL] error on create new account wallet!")

		return err
	}

	log.WithFields(log.Fields{
		"data": newAccountWallet,
	}).Info("[MODEL] success on create new account wallet!")

	return nil
}

func (m *Model) GetActiveAccount(Account *FacePaymentAccount, sessionId string) (err error) {

	log.WithFields(log.Fields{
		"session_id": sessionId,
		"data":       Account,
	}).Info("[MODEL] get active account start...")

	err = m.DBConn.Where("session_id = ? AND is_active = ?", sessionId, "true").First(Account).Error
	if err != nil {
		log.WithFields(log.Fields{
			"error":      err,
			"data":       Account,
			"session_id": sessionId,
			"is_active":  Account.IsActive,
		}).Error("[MODEL] error on get active account with session_id!")
		return err
	}

	log.WithFields(log.Fields{
		"data":       Account,
		"session_id": sessionId,
		"is_active":  Account.IsActive,
	}).Info("[MODEL] success on get active account")

	return nil
}

func (m *Model) GetAccountWallet(FacePaymentWallet *FacePaymentWallet, accountId uint) (err error) {

	log.WithFields(log.Fields{
		"account_id": accountId,
		"data":       FacePaymentWallet,
	}).Info("[MODEL] get account wallet start...")

	err = m.DBConn.Where("account_id = ?", accountId).First(FacePaymentWallet).Error
	if err != nil {
		log.WithFields(log.Fields{
			"error":      err,
			"data":       FacePaymentWallet,
			"account_id": accountId,
		}).Error("[MODEL] error on get face payment wallet with account_id!")

		return err
	}

	log.WithFields(log.Fields{
		"data":       FacePaymentWallet,
		"account_id": accountId,
	}).Info("[MODEL] success on get account wallet")

	return nil
}

func (m *Model) CreateTransactionDb(sessionId string, fpAccount *FacePaymentAccount, FacePaymentTransaction *FacePaymentTransaction) (err error) {

	log.WithFields(log.Fields{
		"session_id":     sessionId,
		"fp_account":     fpAccount,
		"fp_transaction": FacePaymentTransaction,
	}).Info("[MODEL] create transaction start...")

	err = m.DBConn.Select("id").Find(fpAccount).Where("session_id = ?", sessionId).Error
	if err != nil {
		log.WithFields(log.Fields{
			"error":      err,
			"fp_data":    fpAccount,
			"session_id": sessionId,
		}).Error("[MODEL] error on find face payment account with session_id!")

		return err
	}

	FacePaymentTransaction.AccountID = fpAccount.ID
	err = m.DBConn.Create(FacePaymentTransaction).Error
	if err != nil {
		log.WithFields(log.Fields{
			"error":        err,
			"fp_data":      FacePaymentTransaction,
			"fpAccount_id": fpAccount.ID,
		}).Error("[MODEL] error on create face payment transaction!")

		return err
	}

	log.WithFields(log.Fields{
		"fp_data":      FacePaymentTransaction,
		"fpAccount_id": fpAccount.ID,
	}).Info("[MODEL] success on create face payment transaction!")

	return nil
}

func (m *Model) UpdateBalance(fpWallet *FacePaymentWallet) (err error) {

	log.WithFields(log.Fields{
		"fp_wallet": fpWallet,
	}).Info("[MODEL] update balance start...")

	err = m.DBConn.Model(fpWallet).Select("balance", "updated_at").
		Where("id = ?", fpWallet.ID).
		Updates(FacePaymentWallet{
			Balance: fpWallet.Balance,
		},
		).Error

	if err != nil {
		log.WithFields(log.Fields{
			"error":       err,
			"id_fpwallet": fpWallet.ID,
			"data":        fpWallet,
		}).Error("[MODEL] error on Update face payment wallet balance!")

		return err
	}

	log.WithFields(log.Fields{
		"id_fpwallet": fpWallet.ID,
		"data":        fpWallet,
	}).Info("[MODEL] success on Update balance")

	return nil
}
