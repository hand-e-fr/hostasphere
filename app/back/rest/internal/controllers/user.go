package controllers

import (
	"app/internal/utils"
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"net/http"
	"strconv"

	"app/internal/config"
	"app/internal/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

func GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	collection := config.GetCollection("users")

	err := collection.FindOne(nil, bson.M{"email": email}).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}

func GetUserByID(id string) (*models.User, error) {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var user models.User
	collection := config.GetCollection("users")
	err = collection.FindOne(nil, bson.M{"_id": objID}).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}

func UpdateUserRoute(c *gin.Context) {
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

	collection := config.GetCollection("users")

	if user.Password != nil && len(user.Password) != 0 {
		if len(user.Password) > 0 {
			hashedPassword, err := bcrypt.GenerateFromPassword(user.Password, bcrypt.DefaultCost)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
				return
			}
			user.Password = hashedPassword
		}
	} else {
		currentPassword := models.User{}
		err = collection.FindOne(c, bson.M{"_id": objID}).Decode(&currentPassword)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user"})
			return
		}
		user.Password = currentPassword.Password
	}

	_, err = collection.UpdateOne(c, bson.M{"_id": objID}, bson.M{"$set": user})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully"})
}

func DeleteUserRoute(c *gin.Context) {
	userID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	collection := config.GetCollection("users")
	user, err := GetUserByID(userID)
	if user == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	if user.SuperAdmin {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	_, err = collection.DeleteOne(c, bson.M{"_id": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

func ChangePasswordRoute(c *gin.Context) {
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

func GetUserByEmailRoute(c *gin.Context) {
	claims, err := utils.GetTokenValue(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	email := claims.Email

	user, err := GetUserByEmail(email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
		return
	}

	if user == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":             user.ID.Hex(),
		"email":          user.Email,
		"first_name":     user.FirstName,
		"last_name":      user.LastName,
		"is_admin":       user.IsAdmin,
		"is_super_admin": user.SuperAdmin,
		"created_at":     user.CreatedAt,
	})
}

func GetUserByIDRoute(c *gin.Context) {
	claims, err := utils.GetTokenValue(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	if !claims.IsAdmin {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := c.Param("id")

	user, err := GetUserByID(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if user == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":             user.ID.Hex(),
		"email":          user.Email,
		"first_name":     user.FirstName,
		"last_name":      user.LastName,
		"is_admin":       user.IsAdmin,
		"is_super_admin": user.SuperAdmin,
		"created_at":     user.CreatedAt,
	})
}

func GetUsersRoute(c *gin.Context) {
	claims, err := utils.GetTokenValue(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	if !claims.IsAdmin {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	page, err := strconv.Atoi(c.DefaultQuery("page", "0"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page"})
		return
	}
	limit, err := strconv.Atoi(c.DefaultQuery("limit", "10"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid limit"})
		return
	}

	if page < 0 {
		page = 0
	}

	if limit < 0 {
		limit = 10
	}

	if limit > 100 {
		limit = 100
	}

	limit64 := int64(limit)
	skip := int64(page) * limit64

	var users []models.User
	collection := config.GetCollection("users")

	cursor, err := collection.Find(c, bson.M{}, &options.FindOptions{
		Limit: &limit64,
		Skip:  &skip,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get users"})
		return
	}

	defer func(cursor *mongo.Cursor, ctx context.Context) {
		err := cursor.Close(ctx)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to close cursor"})
		}
	}(cursor, c)
	for cursor.Next(c) {
		var user models.User
		err := cursor.Decode(&user)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode user"})
			return
		}
		users = append(users, user)
	}

	c.JSON(http.StatusOK, gin.H{"users": users, "total": len(users)})
}
