package controllers

import (
	"app/internal/utils"
	"net/http"

	"app/internal/config"
	"app/internal/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

func UpdateUser(c *gin.Context) {
	userID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if len(user.Password) > 0 {
		hashedPassword, err := bcrypt.GenerateFromPassword(user.Password, bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
			return
		}
		user.Password = hashedPassword
	}

	collection := config.GetCollection("users")
	_, err = collection.UpdateOne(c, bson.M{"_id": objID}, bson.M{"$set": user})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully"})
}

func DeleteUser(c *gin.Context) {
	userID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	collection := config.GetCollection("users")
	_, err = collection.DeleteOne(c, bson.M{"_id": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

func ChangePassword(c *gin.Context) {
	var input struct {
		UserID      string `json:"user_id"`
		NewPassword string `json:"new_password"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	objID, err := primitive.ObjectIDFromHex(input.UserID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	collection := config.GetCollection("users")
	_, err = collection.UpdateOne(c, bson.M{"_id": objID}, bson.M{
		"$set": bson.M{"password": string(hashedPassword), "needs_password_change": false},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password updated successfully"})
}

func GetUser(c *gin.Context) {
	claims, err := utils.GetTokenValue(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	email := claims.Email

	var user models.User
	collection := config.GetCollection("users")
	err = collection.FindOne(c, bson.M{"email": email}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":        user.ID.Hex(),
		"email":     user.Email,
		"firstName": user.FirstName,
		"lastName":  user.LastName,
		"isAdmin":   user.IsAdmin,
		"createdAt": user.CreatedAt,
	})
}
