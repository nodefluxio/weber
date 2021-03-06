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
		{
			SessionID: "SessionForSolutionPartner",
			Email:     "nodeflux@nodeflux.io",
			FullName:  "Nodeflux Autofill for Partner",
			Company:   "Nodeflux",
			JobTitle:  "Software Engineer",
			Industry:  "Computer Vision",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		// Add new visitor here
	}

	sessionIds := []string{}

	for _, visitor := range visitors {
		if visitor.SessionID != "SessionForSolutionPartner" {
			sessionId := uuid.New()
			sessionIds = append(sessionIds, sessionId.String())
			visitor.SessionID = sessionId.String()
		}
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
			LongDescription:    "Nodeflux Face Match w/ID is a Vision Arti???cial Intelligence Analytics Software which provides accurate matching and recognition. Using a Deep Learning Algorithm to enhance the accuracy of facial inferencing, Nodeflux Face Match w/ID automatically detects facial features from a photo and matches it with a pre-enrolled photo in the database.",
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
			ShortDescription:   "Predicts the gender binary (male/female) of faces recognized in the input picture based on their physical appearance and estimates their age range.",
			LongDescription:    "VisionAIre Face Demography predicts the gender binary (male/female) of faces recognized in the input picture based on their physical appearance and estimates their age range.",
			SpecialInstruction: "Special Instruction for Face Demography",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "Electronic Know Your Customer",
			Type:               "solution",
			Slug:               "ekyc",
			Thumbnail:          "ekyc.jpg",
			AccessKey:          os.Getenv("ACCESS_KEY_EKYC"),
			Token:              os.Getenv("TOKEN_EKYC"),
			Timestamp:          os.Getenv("TIMESTAMP_EKYC"),
			ShortDescription:   "A solution that performs verification and validation of consumers using AI technology to protect registration data and prevent fraud.",
			LongDescription:    "E-KYC solution is a service utilizing  the power of AI to verify customer identitiy. It helps your business conforming customer due diligence (CDD) and minimizing the risk of fraudulent and money laundering.",
			SpecialInstruction: "Special Instruction for EKYC",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "Face Payment",
			Type:               "solution",
			Slug:               "face-payment",
			Thumbnail:          "face-payment.jpg",
			AccessKey:          os.Getenv("ACCESS_KEY_FP"),
			Token:              os.Getenv("TOKEN_FP"),
			Timestamp:          os.Getenv("TIMESTAMP_FP"),
			ShortDescription:   "A cashless payment system with face recognition method to enhance the convenience and security of consumer transactions.",
			LongDescription:    "Face recognition payment is the new touchless experience for customers. Face recognition provides more security compared to other authentication techniques. Because the human face is unique, it is uneasy for an impostor to manipulate the authentication. Bringing contactless payments is way safer on the pandemic. Using face payment,  just by showing your face, no need more to show your phone.",
			SpecialInstruction: "Special Instruction for Face Payment",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "OCR Receipt Recognition",
			Type:               "innovation",
			Slug:               "ocr-receipt",
			Thumbnail:          "ocr-receipt.jpg",
			AccessKey:          "",
			Token:              "",
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
			Thumbnail:          "car-damage.jpg",
			AccessKey:          "",
			Token:              "",
			Timestamp:          "",
			ShortDescription:   "Car Damage Assessment is one of the new innovations developed by Nodeflux (still experimental). This analytic has the ability to detect and assess the level of damage to a car.",
			LongDescription:    "Nodeflux has developed a new technology that has the ability to detect and assess the level of damage to a car, called Car Damage Assessment. The parts of the damage that can be detected are the front side, wing (left and right) side, and back side of the car. This analytic also provides an assessment of the level of damage detected, so it can be used to help industries such as car insurance or car repair shops. In the future, this innovation will continue to improve.",
			SpecialInstruction: "Special Instruction for Car Damage Assessment",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "Face Occlusion & Attribute",
			Type:               "innovation",
			Slug:               "face-occlusion-attribute",
			Thumbnail:          "face-occlusion-attribute.jpg",
			AccessKey:          "",
			Token:              "",
			Timestamp:          "",
			ShortDescription:   "Analytics that ensure the user's face is clear and can safely perform further face analytics. Face occlusion can detect the area of the face that is covered by objects, while face attribute can detect the type of attribute found in the face area.",
			LongDescription:    "This analytics is a combination of face occlusion and face attributes detection. Face occlusion can detect the area of the face that is covered by objects, while face attribute can detect the type of attribute found in the face area. The combination of these two analytics can ensure the user's face is clearly visible and can safely perform the face liveness and face recognition processes.",
			SpecialInstruction: "Special Instruction for Face Occlusion & Attribute",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "Road Traffic Monitoring",
			Type:               "solution-partner",
			Slug:               "http://nodeflux-registration.komunestudio.com",
			Thumbnail:          "road-traffic-monitoring.jpg",
			AccessKey:          "",
			Token:              "",
			Timestamp:          "",
			ShortDescription:   "A real time vehicle activity and traffic density monitoring system that provides visual insight based on factual data taken from CCTV.",
			LongDescription:    "",
			SpecialInstruction: "",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "Mobile Employee Attendance (HRIS)",
			Type:               "solution-partner",
			Slug:               "https://employee.caliana.id/auth?signup",
			Thumbnail:          "hris.jpg",
			AccessKey:          "",
			Token:              "",
			Timestamp:          "",
			ShortDescription:   "A mobile application based remote attendance system equipped with interesting features for the safety and comfort of your employees.",
			LongDescription:    "",
			SpecialInstruction: "",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "Citizen Apps",
			Type:               "solution-partner",
			Slug:               "https://apps.apple.com/id/app/jaki/id1509621798?l=id;https://play.google.com/store/apps/details?id=id.go.jakarta.smartcity.jaki&hl=en&gl=US",
			Thumbnail:          "citizen-apps.jpg",
			AccessKey:          "",
			Token:              "",
			Timestamp:          "",
			ShortDescription:   "An official local government information center application that integrates various services for citizens.",
			LongDescription:    "",
			SpecialInstruction: "",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "Health Protocol Enforcement (Covid Solution)",
			Type:               "solution-partner",
			Slug:               "http://nodeflux-registration.komunestudio.com",
			Thumbnail:          "covid-solution.jpg",
			AccessKey:          "",
			Token:              "",
			Timestamp:          "",
			ShortDescription:   "A solution for enforcement of health protocol to reduce the spread of covid-19 during the pandemic.",
			LongDescription:    "",
			SpecialInstruction: "",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "AML / PEP",
			Type:               "solution-partner",
			Slug:               "aml-pep",
			Thumbnail:          "AML-PEP.jpg",
			AccessKey:          "",
			Token:              "",
			Timestamp:          "",
			ShortDescription:   "A service provider platform that is able to detect high risk customers (AML) by checking the background (PEP) of each customer.",
			LongDescription:    "",
			SpecialInstruction: "",
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		},
		{
			Name:               "Passive Face Liveness Detection",
			Type:               "solution",
			Slug:               "passive-liveness",
			Thumbnail:          "passive-liveness.png",
			AccessKey:          os.Getenv("ACCESS_KEY_PFL"),
			Token:              os.Getenv("TOKEN_PFL"),
			Timestamp:          os.Getenv("TIMESTAMP_PFL"),
			ShortDescription:   "Liveness detection is a Machine Learning based solution to check the selfie is presented a human being or an inanimate spoof artifact.",
			LongDescription:    "Liveness detection is a Machine Learning based solution to determine the likelihood of an organization interfacing with a physically present human being and an inanimate spoof artifact.",
			SpecialInstruction: "Special Instruction for Passive Face Liveness Detection",
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
