package models

import (
	"time"
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
	err = m.DBConn.Select("SessionID", "FullName", "Phone", "HaveTwin", "CreatedAt", "UpdatedAt").Create(newAccount).Error
	if err != nil {
		return err
	}

	return nil
}

func (m *Model) ActivateAccount(newAccount *FacePaymentAccount) (err error) {
	var account *FacePaymentAccount

	// Get the last record of registered account with same session_id
	m.DBConn.Where("session_id = ? ", newAccount.SessionID).Last(&account)

	// Update the last registered account's data and activate it
	err = m.DBConn.Model(&account).Updates(FacePaymentAccount{
		Pin:            newAccount.Pin,
		MinimumPayment: newAccount.MinimumPayment,
		IsActive:       true,
		UpdatedAt:      newAccount.UpdatedAt,
	},
	).Error

	if err != nil {
		return err
	}

	return nil
}

func (m *Model) CreateAccountWallet(sessionId string, newAccountWallet *FacePaymentWallet) (err error) {
	var newAccount *FacePaymentAccount

	err = m.DBConn.Where("session_id = ? AND is_active = ?", sessionId, "true").Last(&newAccount).Error
	if err != nil {
		return err
	}

	newAccountWallet.AccountID = newAccount.ID
	err = m.DBConn.Create(newAccountWallet).Error
	if err != nil {
		return err
	}

	return nil
}

func (m *Model) GetAccount(Account *FacePaymentAccount, sessionId string) (err error) {
	err = m.DBConn.Where("session_id = ?", sessionId).First(Account).Error
	if err != nil {
		return err
	}
	return nil
}

func (m *Model) GetActiveAccount(Account *FacePaymentAccount, sessionId string) (err error) {
	err = m.DBConn.Where("session_id = ? AND is_active = ?", sessionId, "true").First(Account).Error
	if err != nil {
		return err
	}

	return nil
}

func (m *Model) GetAccountWallet(FacePaymentWallet *FacePaymentWallet, accountId uint) (err error) {
	err = m.DBConn.Where("account_id = ?", accountId).First(FacePaymentWallet).Error
	if err != nil {
		return err
	}
	return nil
}

func (m *Model) CreateTransactionDb(sessionId string, fpAccount *FacePaymentAccount, FacePaymentTransaction *FacePaymentTransaction) (err error) {
	err = m.DBConn.Select("id").Find(fpAccount).Where("session_id = ?", sessionId).Error
	if err != nil {
		return err
	}

	FacePaymentTransaction.AccountID = fpAccount.ID
	err = m.DBConn.Create(FacePaymentTransaction).Error
	if err != nil {
		return err
	}
	return nil
}

func (m *Model) UpdateBalance(fpWallet *FacePaymentWallet) (err error) {
	err = m.DBConn.Model(fpWallet).Select("balance", "updated_at").
		Where("id = ?", fpWallet.ID).
		Updates(FacePaymentWallet{
			Balance: fpWallet.Balance,
		},
		).Error

	if err != nil {
		return err
	}

	return nil
}
