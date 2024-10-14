package controllers

import (
	"app/internal/config"
	"app/internal/models"
	"app/internal/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"time"
)

type CreateTokenRequest struct {
	Name string `json:"name"`
}

func CreateToken(c *gin.Context) {
	claims, err := GetTokenValue(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	var input CreateTokenRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tokenValue, _ := utils.GenerateToken()
	hashedToken, err := bcrypt.GenerateFromPassword([]byte(tokenValue), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	token := models.Token{
		Name:           input.Name,
		Value:          hashedToken,
		DisplayedValue: string(tokenValue[:8]) + "..." + (tokenValue[len(tokenValue)-4:]),
		CreatedAt:      time.Now().UnixMilli(),
		LastUsed:       0,
		Owner:          claims.Email,
	}

	if err := config.GetCollection("tokens").FindOne(c, gin.H{"name": input.Name}).Err(); err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Token already exists"})
		return
	}

	_, err = config.GetCollection("tokens").InsertOne(c, token)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Token created successfully", "token": tokenValue})
}

func GetTokens(c *gin.Context) {
	_, err := GetTokenValue(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	var tokens []models.Token
	cursor, err := config.GetCollection("tokens").Find(c, gin.H{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(c)
	if err := cursor.All(c, &tokens); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"tokens": tokens})
}

func ExistsToken(c *gin.Context) {
	tokenValue := c.Param("token")

	var tokens []models.Token
	cursor, err := config.GetCollection("tokens").Find(c, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(c)
	if err := cursor.All(c, &tokens); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	for _, token := range tokens {
		err := bcrypt.CompareHashAndPassword(token.Value, []byte(tokenValue))
		if err == nil {
			c.JSON(http.StatusOK, gin.H{"exists": true, "id": token.ID})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"exists": false})
}

func DeleteToken(c *gin.Context) {
	claims, err := GetTokenValue(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	tokenID := c.Param("token")

	// tokenID to ObjectID
	var oid primitive.ObjectID
	if oid, err = primitive.ObjectIDFromHex(tokenID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid token ID"})
		return
	}

	var token models.Token
	if err := config.GetCollection("tokens").FindOne(c, bson.M{"_id": oid}).Decode(&token); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Token not found"})
		return
	}

	if token.Owner != claims.Email && !claims.IsAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not allowed to delete this token"})
		return
	}

	if _, err := config.GetCollection("tokens").DeleteOne(c, bson.M{"_id": oid}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Token deleted successfully"})
}

func TokenNameFromId(c *gin.Context) {
	tokenID := c.Param("token")

	// tokenID to ObjectID
	var oid primitive.ObjectID
	var err error
	if oid, err = primitive.ObjectIDFromHex(tokenID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid token ID"})
		return
	}

	var token models.Token
	if err := config.GetCollection("tokens").FindOne(c, bson.M{"_id": oid}).Decode(&token); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Token not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"name": token.Name})
}
