package models

import (
	"time"
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