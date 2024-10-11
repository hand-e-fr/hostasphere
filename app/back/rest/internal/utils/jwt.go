package utils

import (
	"app/internal/controllers"
	"app/internal/models"
	"fmt"
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

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	if claims.ExpiresAt < time.Now().Unix() {
		return nil, fmt.Errorf("token expired")
	}

	user, err := controllers.GetUserByID(claims.Id)
	if err != nil {
		return nil, fmt.Errorf("could not find user")
	}

	if user.IsAdmin != claims.IsAdmin || user.NeedsPasswordChange != claims.NeedsPasswordChange || user.Email != claims.Email {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil
}
