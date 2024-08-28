package controllers

import (
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"net/http"
	"time"

	"app/internal/config"
	"app/internal/models"
	"app/internal/utils"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func isCorrectInputs(input models.RegisterUserRequest) error {
	if len(input.Email) == 0 || len(input.Email) > 100 {
		return errors.New("invalid email, must be between 1 and 100 characters")
	}
	if len(input.FirstName) == 0 || len(input.FirstName) > 50 {
		return errors.New("invalid first name, must be between 1 and 50 characters")
	}
	if len(input.LastName) == 0 || len(input.LastName) > 50 {
		return errors.New("invalid last name, must be between 1 and 50 characters")
	}
	if len(input.Password) < 8 || len(input.Password) > 50 {
		return errors.New("invalid password, must be between 8 and 50 characters")
	}
	if !utils.IsEmailValid(input.Email) {
		return errors.New("invalid email, must be a valid email address")
	}
	if !utils.IsPasswordStrong(input.Password) {
		return errors.New("invalid password, must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character")
	}
	return nil
}

func SaveUser(request models.RegisterUserRequest, needsPasswordChange bool, isAdmin bool) error {
	err := isCorrectInputs(request)
	if err != nil {
		return err
	}

	collection := config.GetCollection("users")
	var user models.User
	err = collection.FindOne(context.Background(), bson.M{"email": request.Email}).Decode(&user)
	if err == nil {
		return models.ErrUserExists
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user = models.User{
		Email:               request.Email,
		FirstName:           request.FirstName,
		LastName:            request.LastName,
		Password:            hashedPassword,
		IsAdmin:             isAdmin,
		NeedsPasswordChange: needsPasswordChange,
		CreatedAt:           time.Now().UnixMilli(),
	}

	_, err = collection.InsertOne(context.Background(), user)
	if err != nil {
		return err
	}
	return nil
}

func RegisterUser(c *gin.Context) {
	claims, err := utils.GetTokenValue(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	if !claims.IsAdmin {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var input models.RegisterUserRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := SaveUser(input, true, false); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
}

func Login(c *gin.Context) {
	var input models.LoginRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	collection := config.GetCollection("users")
	err := collection.FindOne(c, bson.M{"email": input.Email}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	err = bcrypt.CompareHashAndPassword(user.Password, []byte(input.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if user.NeedsPasswordChange {
		c.JSON(http.StatusOK, gin.H{"message": "Password change required"})
		return
	}

	token, err := utils.GenerateJWT(user.Email, user.IsAdmin)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

func CheckToken(c *gin.Context) {
	claims, err := utils.GetTokenValue(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"ok": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": true, "email": claims.Email, "is_admin": claims.IsAdmin})
}
