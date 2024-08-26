package handlers

import (
	"context"
	"net/http"
	"time"

	"back/internal/models"
	"back/internal/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func RegisterLicense(c *gin.Context) {
	var license models.License
	if err := c.ShouldBindJSON(&license); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userEmail, exists := c.Get("userEmail")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	collection := utils.DB.Collection("users")
	var user models.User
	err := collection.FindOne(context.TODO(), bson.M{"email": userEmail}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	license.UserID = user.ID
	license.Expiration = time.Now().AddDate(1, 0, 0) // 1 year from now
	license.SecretID = primitive.NewObjectID().Hex()

	licenseCollection := utils.DB.Collection("licenses")
	_, err = licenseCollection.InsertOne(context.TODO(), license)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "License registered successfully", "secret_id": license.SecretID})
}

func RenewLicense(c *gin.Context) {
	id := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	licenseCollection := utils.DB.Collection("licenses")
	filter := bson.M{"_id": objID}

	update := bson.M{"$set": bson.M{"expiration": time.Now().AddDate(1, 0, 0)}} // extend by 1 year
	_, err = licenseCollection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "License renewed successfully"})
}

func DeleteLicense(c *gin.Context) {
	id := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	licenseCollection := utils.DB.Collection("licenses")
	_, err = licenseCollection.DeleteOne(context.TODO(), bson.M{"_id": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "License deleted successfully"})
}

func GetLicenseInfo(c *gin.Context) {
	id := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	licenseCollection := utils.DB.Collection("licenses")
	var license models.License
	err = licenseCollection.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&license)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "License not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"license": license})
}

func ValidateLicense(c *gin.Context) {
	secretID := c.Param("secretID")

	licenseCollection := utils.DB.Collection("licenses")
	var license models.License
	err := licenseCollection.FindOne(context.TODO(), bson.M{"secret_id": secretID}).Decode(&license)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "License not found"})
		return
	}

	isValid := time.Now().Before(license.Expiration)
	c.JSON(http.StatusOK, gin.H{"valid": isValid, "expiration": license.Expiration})
}
