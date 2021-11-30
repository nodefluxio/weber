package database

import (
	"backend/models"
	"os"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func seedVisitor(model *models.Model) []string {
	var visitors = []models.Visitor{
		{
			SessionID: "",
			Email:     "natasha@nodeflux.io",
			FullName:  "Natasha Romanoff",
			Company:   "The Black Widow Ops Program",
			JobTitle:  "Product Manager",
			Industry:  "Computer Vision",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			SessionID: "",
			Email:     "bucky@nodeflux.io",
			FullName:  "Bucky Barnes",
			Company:   "The Winter Soldier Corp",
			JobTitle:  "Software Engineer",
			Industry:  "Computer Vision",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		// Add new visitor here
	}

	sessionIds := []string{}

	for _, visitor := range visitors {
		sessionId := uuid.New()
		sessionIds = append(sessionIds, sessionId.String())
		visitor.SessionID = sessionId.String()
		model.CreateVisitor(&visitor)
	}

	return sessionIds
}

func seedVisitorActivity(model *models.Model, sessionIds []string) {
	for _, sessionId := range sessionIds {
		var visitorActivity = &models.VisitorActivity{
			SessionID:    sessionId,
			ServiceID:    1,
			Completeness: 100,
		}
		model.CreateVisitorActivity(visitorActivity)
	}
}

func seedService(model *models.Model) {
	// all tokens and access keys provided here are just a random example
	var services = []models.Service{
		{
			Name:               "OCR Kartu Tanda Penduduk",
			Type:               "analytic",
			Slug:               "ocr-ktp",
			Thumbnail:          "ocr-ktp.png",
			AccessKey:          os.Getenv("ACCESS_KEY_OCR"),
			Token:              os.Getenv("TOKEN_OCR"),
			Timestamp:          os.Getenv("TIMESTAMP_OCR"),
			ShortDescription:   "OCR KTP has the ability to read and extract Indonesian ID cards (KTP) automatically using AI-based algorithm.",
			LongDescription:    "Not only to capture important data, our OCR help you to organize the unstructured data to structured data which easy to be organized. AI-based algorithm applied to perform Optical Character Recognition (OCR) for KTP ID attributes extraction, to automate data input and capture ID photo for matching process.",
			SpecialInstruction: "Special Instruction for OCR KTP",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "License Plate Recognition",
			Type:               "analytic",
			Slug:               "license-plate-recognition",
			Thumbnail:          "license-plate-recognition.png",
			AccessKey:          os.Getenv("ACCESS_KEY_LPR"),
			Token:              os.Getenv("TOKEN_LPR"),
			Timestamp:          os.Getenv("TIMESTAMP_LPR"),
			ShortDescription:   "Recognize vehicle licese plate number from vehicle passing by that captured by camera",
			LongDescription:    "Nodeflux License Plate Recognition (LPR) is a Vision Artificial Intelligence Analytics Software which provides recognition of face plates for all types of vehicles. Nodeflux LPR is using a Deep Learning algorithm developed to adapt real conditions in Indonesia, like various kinds of plate, and any wide range of environmental conditions.",
			SpecialInstruction: "Special Instruction for LPR",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "People Density",
			Type:               "analytic",
			Slug:               "people-density",
			Thumbnail:          "people-density.png",
			AccessKey:          os.Getenv("ACCESS_KEY_PD"),
			Token:              os.Getenv("TOKEN_PD"),
			Timestamp:          os.Getenv("TIMESTAMP_PD"),
			ShortDescription:   "Calculate number of people in certain area within defined period of time",
			LongDescription:    "VisionAire people density detects the average number of people passing by  certain locations every 15 minutes. Camera will take pictures once every designated time (can be seconds or minutes). The number serves as an indicator of public mobility intensity.",
			SpecialInstruction: "Special Instruction for People Density",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "Face Match with Enrollment",
			Type:               "analytic",
			Slug:               "face-match-enrollment",
			Thumbnail:          "face-match-enrollment.png",
			AccessKey:          os.Getenv("ACCESS_KEY_FME"),
			Token:              os.Getenv("TOKEN_FME"),
			Timestamp:          os.Getenv("TIMESTAMP_FME"),
			ShortDescription:   "An ability to determine the resemblance between  two photos, which will produce a degree of similarity in the form of probability",
			LongDescription:    "Nodeflux Face Match w/ID is a Vision Artiﬁcial Intelligence Analytics Software which provides accurate matching and recognition. Using a Deep Learning Algorithm to enhance the accuracy of facial inferencing, Nodeflux Face Match w/ID automatically detects facial features from a photo and matches it with a pre-enrolled photo in the database.",
			SpecialInstruction: "Special Instruction for Face Match with Enrollment",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "Face Mask Detection",
			Type:               "analytic",
			Slug:               "face-mask",
			Thumbnail:          "face-mask.png",
			AccessKey:          os.Getenv("ACCESS_KEY_FMD"),
			Token:              os.Getenv("TOKEN_FMD"),
			Timestamp:          os.Getenv("TIMESTAMP_FMD"),
			ShortDescription:   "Recognize one input face within enrolled database to make N-similar face output",
			LongDescription:    "Face Mask Detection is a solution product to detect face masks used by users. Nodeflux VisionAIre will detect & count the number of people wearing masks or not. The application of this technology can be applied to wide area shooting in surveillance cases. The system will provide information when a masked object is detected.",
			SpecialInstruction: "Special Instruction for Face Mask Detection",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "Face Demography",
			Type:               "analytic",
			Slug:               "face-demography",
			Thumbnail:          "face-demography.png",
			AccessKey:          os.Getenv("ACCESS_KEY_FD"),
			Token:              os.Getenv("TOKEN_FD"),
			Timestamp:          os.Getenv("TIMESTAMP_FD"),
			ShortDescription:   "Face Demography Description",
			LongDescription:    "Face Demography Looonng Descriptiooonnn",
			SpecialInstruction: "Special Instruction for Face Demography",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "Electronic Know Your Customer",
			Type:               "solution",
			Slug:               "ekyc",
			Thumbnail:          "ekyc.png",
			AccessKey:          os.Getenv("ACCESS_KEY_EKYC"),
			Token:              os.Getenv("TOKEN_EKYC"),
			Timestamp:          os.Getenv("TIMESTAMP_EKYC"),
			ShortDescription:   "A platform that helps your business performing recognition, verification and validation of customer through state-of-the-art AI technology to protect customer registration data and prevent fraud.",
			LongDescription:    "E-KYC solution is a service utilizing  the power of AI to verify customer identitiy. It helps your business conforming customer due diligence (CDD) and minimizing the risk of fraudulent and money laundering.",
			SpecialInstruction: "Special Instruction for EKYC",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "Face Payment",
			Type:               "solution",
			Slug:               "face-payment",
			Thumbnail:          "face-payment.png",
			AccessKey:          os.Getenv("ACCESS_KEY_FP"),
			Token:              os.Getenv("TOKEN_FP"),
			Timestamp:          os.Getenv("TIMESTAMP_FP"),
			ShortDescription:   "Cashless payment with face recognition methods by prioritizing the convenience and security of users in transactions with no card and smartphone needed",
			LongDescription:    "Face recognition payments are a touchless experience for customers. Face recognition provides more security compared to other authentication techniques. Because The human face is unique and can not easily be manipulated. this method of contactless payments is way safer on the pandemic. with face payment, you don’t have to show your phone, just show your face.",
			SpecialInstruction: "Special Instruction for Face Payment",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "OCR Receipt Recognition",
			Type:               "innovation",
			Slug:               "ocr-receipt",
			Thumbnail:          "ocr-receipt.png",
			AccessKey:          "",
			Token:				"",
			Timestamp:          "",
			ShortDescription:   "OCR Receipt Recognition is one of the new innovations developed by Nodeflux (still experimental). This analytic has the ability to read and extract the characters on a shopping receipt issued by various supermarkets.",
			LongDescription:    "Nodeflux has developed new technology that allows users to more easily extract data from receipts, called OCR Receipt Recognition. The following data can be extracted: product description, location, price, and total price. By extracting this data, sellers will be able to analyze buyer behavior, and prepare for campaigns, discounts, and cashback in order to set product prices, encourage product improvements, and promote products. In the future, this innovation will continue to improve.",
			SpecialInstruction: "Special Instruction for OCR Receipt Recognition",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "Car Damage Assessment",
			Type:               "innovation",
			Slug:               "car-damage",
			Thumbnail:          "car-damage.png",
			AccessKey:          "",
			Token:             	"",
			Timestamp:          "",
			ShortDescription:   "Car Damage Assessment is one of the new innovations developed by Nodeflux (still experimental). This analytic has the ability to detect and assess the level of damage to a car.",
			LongDescription:    "Nodeflux has developed a new technology that has the ability to detect and assess the level of damage to a car, called Car Damage Assessment. The parts of the damage that can be detected are the front side, wing (left and right) side, and back side of the car. This analytic also provides an assessment of the level of damage detected, so it can be used to help industries such as car insurance or car repair shops. In the future, this innovation will continue to improve.",
			SpecialInstruction: "Special Instruction for Car Damage Assessment",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		// Add new service here
	}

	for _, service := range services {
		model.CreateService(&service)
	}
}

func Seed(db *gorm.DB) {
	model := models.New(db)
	sessionIds := seedVisitor(model)
	seedService(model)
	seedVisitorActivity(model, sessionIds)
}
