package controllers

import (
	"net/http"

	"app/internal/config"
	"app/internal/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func UpdateLicense(c *gin.Context) {
	appID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(appID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var license models.License
	if err := c.ShouldBindJSON(&license); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection := config.GetCollection("apps")
	_, err = collection.UpdateOne(c, bson.M{"_id": objID}, bson.M{"$set": bson.M{"license": license}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update license"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "License updated successfully"})
}
