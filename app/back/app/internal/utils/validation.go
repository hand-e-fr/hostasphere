package utils

import (
	"errors"
	"github.com/gin-gonic/gin"
	"regexp"
	"unicode"
)

func IsEmailValid(email string) bool {
	const emailRegex = `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
	re := regexp.MustCompile(emailRegex)
	return re.MatchString(email)
}

func IsPasswordStrong(password string) bool {
	var (
		hasMinLen  = false
		hasUpper   = false
		hasLower   = false
		hasNumber  = false
		hasSpecial = false
	)

	if len(password) >= 8 {
		hasMinLen = true
	}

	for _, char := range password {
		switch {
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsDigit(char):
			hasNumber = true
		case unicode.IsPunct(char) || unicode.IsSymbol(char):
			hasSpecial = true
		}
	}

	return hasMinLen && hasUpper && hasLower && hasNumber && hasSpecial
}

func GetTokenValue(c *gin.Context) (*Claims, error) {
	tokenString := c.GetHeader("Authorization")
	if len(tokenString) < 8 {
		return nil, errors.New("invalid token")
	}
	tokenString = tokenString[7:]

	claims, err := ValidateJWT(tokenString)
	if err != nil {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}
