package utils

import (
	"backend/database"
	"backend/models"
	"fmt"
	"log"
	"os"
	"reflect"
	"strconv"
	"strings"
	"time"

	"github.com/go-playground/locales/en"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	en_translations "github.com/go-playground/validator/v10/translations/en"
)

var (
	uni      *ut.UniversalTranslator
	Validate *validator.Validate
	trans    ut.Translator
)

func InitTranslation() {
	en := en.New()
	uni = ut.New(en, en)
	trans, _ = uni.GetTranslator("en")
	Validate = validator.New()
	Validate.RegisterTagNameFunc(func(fld reflect.StructField) string {
		name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
		if name == "-" {
			return ""
		}
		return name
	})
	en_translations.RegisterDefaultTranslations(Validate, trans)
}

func TranslateError(err error) (errs []error) {
	if err == nil {
		return nil
	}
	validatorErrs := err.(validator.ValidationErrors)
	for _, e := range validatorErrs {
		translatedErr := fmt.Errorf(e.Translate(trans))
		errs = append(errs, translatedErr)
	}
	return errs
}

func IsSessionExist(sessionId string) bool {
	db := database.GetDB()
	var visitor models.Visitor

	if err := models.GetVisitor(db, &visitor, sessionId); err != nil {
		return false
	}

	visitorCreatedAt = visitor.CreatedAt
	return true
}

func IsSessionExpired(sessionId string) bool {
	expirationLimit, err := strconv.Atoi(os.Getenv("SESSION_EXPIRATION"))
	if err != nil {
		log.Fatal("environment variable 'SESSION_EXPIRATION' is not set")
	}

	dateExpiration := visitorCreatedAt.AddDate(0, 0, expirationLimit)
	dateNow := time.Now()

	return dateNow.After(dateExpiration)
}
