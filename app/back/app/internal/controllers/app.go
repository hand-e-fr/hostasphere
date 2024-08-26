package controllers

import (
	"net/http"

	"app/internal/config"
	"app/internal/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func RegisterApp(c *gin.Context) {
	var app models.App
	if err := c.ShouldBindJSON(&app); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection := config.GetCollection("apps")
	_, err := collection.InsertOne(c, app)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register app"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "App registered successfully"})
}

func GetApp(c *gin.Context) {
	appID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(appID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var app models.App
	collection := config.GetCollection("apps")
	err = collection.FindOne(c, bson.M{"_id": objID}).Decode(&app)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "App not found"})
		return
	}

	c.JSON(http.StatusOK, app)
}

func UpdateApp(c *gin.Context) {
	appID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(appID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var app models.App
	if err := c.ShouldBindJSON(&app); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection := config.GetCollection("apps")
	_, err = collection.UpdateOne(c, bson.M{"_id": objID}, bson.M{"$set": app})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update app"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "App updated successfully"})
}
