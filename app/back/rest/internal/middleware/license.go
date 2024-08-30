package middleware

import (
	"net/http"

	"app/internal/config"
	"app/internal/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func LicenseValidationMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Fetch the app and its license from the database
		var app models.App
		collection := config.GetCollection("apps")
		err := collection.FindOne(c, bson.M{}).Decode(&app) // Assuming there's only one app
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch app data"})
			c.Abort()
			return
		}

		// Validate the license
		licenseValid := validateLicense(app.License.SecretID)
		if !licenseValid {
			c.JSON(http.StatusForbidden, gin.H{"error": "License is not valid"})
			c.Abort()
			return
		}

		c.Next()
	}
}

func validateLicense(secretID string) bool {
	// Make an HTTP request to validate the license
	resp, err := http.Get("http://license.hand-e.fr/license/validate/" + secretID)
	if err != nil {
		return false
	}
	defer resp.Body.Close()

	return resp.StatusCode == http.StatusOK
}
