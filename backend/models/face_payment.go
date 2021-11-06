package models

import (
	"time"

	"gorm.io/gorm"
)

type FacePaymentAccount struct {
	ID				uint 			`gorm:"primaryKey; autoIncrement" json:"id"`
	SessionID    	string  		
	Visitor      	Visitor 		`gorm:"foreignKey:SessionID"`
	FullName		string
	Phone			string 			`gorm:"uniqueIndex"`
	Pin				string
	MinimumPayment	int				`gorm:"default:50000"`
	HaveTwin		bool			`gorm:"default:false"`
	IsActive		bool			`gorm:"default:false"`
	CreatedAt		time.Time
	UpdatedAt		time.Time
}

type NewAccountData struct {
	SessionID   string  	`json:"session_id"`
	FullName	string		`json:"full_name" validate:"required,min=2,max=255"`
	Phone		string 		`json:"phone" validate:"required,numeric"`
	HaveTwin	*bool		`json:"have_twin" validate:"required"`
	Data		RequestData	`json:"data"`
	CreatedAt 	time.Time 	`json:"created_at"`
	UpdatedAt 	time.Time 	`json:"updated_at"`
}

type FacePaymentWallet struct {
	ID					uint				`gorm:"primaryKey; autoIncrement" json:"id"`
	AccountID			uint
	FacePaymentAccount	FacePaymentAccount	`gorm:"foreignKey:AccountID"`
	Balance				int					`gorm:"default:1000000"`
}

type FacePaymentTransaction struct {
	ID					uint				`gorm:"primaryKey; autoIncrement" json:"id"`
	AccountID			uint
	FacePaymentAccount	FacePaymentAccount	`gorm:"foreignKey:AccountID"`
	Amount				int
	Notes				string				
	CreatedAt			time.Time
}

func CreateAccount(db *gorm.DB, newAccount *FacePaymentAccount) (err error) {
	err = db.Select("SessionID", "FullName", "Phone", "HaveTwin", "CreatedAt", "UpdatedAt").Create(newAccount).Error
	if err != nil {
		return err
	}
	return nil
}