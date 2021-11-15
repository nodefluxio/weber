package models

import (
	"time"
)

type FacePaymentAccount struct {
	ID             uint `gorm:"primaryKey; autoIncrement" json:"id"`
	SessionID      string
	Visitor        Visitor `gorm:"foreignKey:SessionID"`
	FullName       string
	Phone          string `gorm:"uniqueIndex"`
	Pin            string
	MinimumPayment int  `gorm:"default:50000"`
	HaveTwin       bool `gorm:"default:false"`
	IsActive       bool `gorm:"default:false"`
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

type NewAccountData struct {
	SessionID string      `json:"session_id"`
	FullName  string      `json:"full_name" validate:"required,min=2,max=255"`
	Phone     string      `json:"phone" validate:"required,numeric,min=12,max=15"`
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

type Payment struct {
	SessionID string `json:"session_id"`
	Phone     string `json:"phone" validate:"required,numeric"`
	Pin       string `json:"pin" validate:"required,numeric,min=6,max=6"`
	Amount    int
	Data      RequestData `json:"data"`
}

type CheckLimitInput struct {
	SessionID string `json:"session_id"`
	Phone     string `json:"phone" validate:"required,numeric"`
	Amount    int    `json:"amount"`
}

type CheckLimitResult struct {
	FullName string `json:"full_name"`
	Balance  int    `json:"balance"`
	IsLimit  bool   `json:"is_limit"`
}

type CheckSessionResult struct {
	IsActive     bool `json:"is_active"`
	IsRegistered bool `json:"is_registered"`
}

func (m *Model) CreateAccount(newAccount *FacePaymentAccount) (err error) {
	err = m.DBConn.Select("SessionID", "FullName", "Phone", "HaveTwin", "CreatedAt", "UpdatedAt").Create(newAccount).Error
	if err != nil {
		return err
	}

	return nil
}

func (m *Model) ActivateAccount(newAccount *FacePaymentAccount) (err error) {
	err = m.DBConn.Model(newAccount).Select("Pin", "MinimumPayment", "IsActive", "UpdatedAt").
		Where("session_id = ?", newAccount.SessionID).
		Updates(FacePaymentAccount{
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

func (m *Model) CreateAccountWallet(sessionId string, newAccount *FacePaymentAccount, newAccountWallet *FacePaymentWallet) (err error) {
	err = m.DBConn.Select("id").Find(newAccount).Where("session_id = ?", sessionId).Error
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

func (m *Model) GetAccount(FacePaymentAccount *FacePaymentAccount, id string) (err error) {
	err = m.DBConn.Where("session_id = ?", id).First(FacePaymentAccount).Error
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

func (m *Model) UpdateBalance(newAccount *FacePaymentAccount) (err error) {
	err = m.DBConn.Model(newAccount).Select("MinimumPayment", "UpdatedAt").
		Where("session_id = ?", newAccount.SessionID).
		Updates(FacePaymentAccount{
			MinimumPayment: newAccount.MinimumPayment,
			UpdatedAt:      newAccount.UpdatedAt,
		},
		).Error

	if err != nil {
		return err
	}

	return nil
}
