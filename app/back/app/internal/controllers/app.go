package controllers

import (
	"fmt"
	"net/http"

	"app/internal/config"
	"app/internal/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func RegisterApp(c *gin.Context) {
	var appRequest models.RegisterAppRequest
	if err := c.ShouldBindJSON(&appRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// check if app is already registered
	collection := config.GetCollection("apps")
	count, err := collection.CountDocuments(c, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check if app is already registered"})
		return
	}
	if count > 0 {
		err = collection.Drop(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to drop existing app"})
			return
		}
	}

	var app = models.App{
		Name: appRequest.Name,
		License: models.License{
			ID:       appRequest.License.ID,
			SecretID: appRequest.License.SecretID,
		},
	}

	collection = config.GetCollection("apps")
	_, err = collection.InsertOne(c, app)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register app"})
		return
	}

	// Register the admin user
	err = SaveUser(appRequest.AdminUser, false, true)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "App registered successfully"})
}

func GetApp(c *gin.Context) {
	var app models.App
	collection := config.GetCollection("apps")
	err := collection.FindOne(c, bson.M{}).Decode(&app) // Assuming there's only one app
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "App not found"})
		return
	}

	c.JSON(http.StatusOK, app)
}

func IsAppInitialized(c *gin.Context) {
	fmt.Println("IsAppInitialized")
	collection := config.GetCollection("apps")
	fmt.Println(collection)
	count, err := collection.CountDocuments(c, bson.M{})
	fmt.Println(count)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check if app is initialized"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"initialized": count > 0})
}

func UpdateApp(c *gin.Context) {
	var app models.App
	err := c.ShouldBindJSON(&app)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection := config.GetCollection("apps")
	_, err = collection.UpdateOne(c, bson.M{}, bson.M{"$set": app})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update app"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "App updated successfully"})
}
