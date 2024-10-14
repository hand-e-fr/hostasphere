package controllers

import (
	"app/internal/models"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var jwtKey = []byte(os.Getenv("JWT_SECRET"))

func GenerateJWT(id string, email string, isAdmin bool, expirationTime time.Time, NeedsPasswordChange bool) (string, error) {
	claims := &models.Claims{
		Id:                  id,
		Email:               email,
		IsAdmin:             isAdmin,
		NeedsPasswordChange: NeedsPasswordChange,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)
}

func ValidateJWT(tokenString string) (*models.Claims, error) {
	claims := &models.Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err != nil {
		return nil, err
	}

	if claims == nil || !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	if claims.ExpiresAt < time.Now().Unix() {
		return nil, fmt.Errorf("token expired")
	}

	user, err := GetUserByID(claims.Id)
	if err != nil || user == nil {
		return nil, fmt.Errorf("could not find user")
	}

	if user.IsAdmin != claims.IsAdmin ||
		user.NeedsPasswordChange != claims.NeedsPasswordChange ||
		user.Email != claims.Email {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil
}

func GetTokenValue(c *gin.Context) (*models.Claims, error) {
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
