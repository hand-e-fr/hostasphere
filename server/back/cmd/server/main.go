package main

import (
	"log"
	"os"

	"back/internal/handlers"
	"back/internal/middleware"
	"back/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	utils.ConnectDB()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := gin.Default()

	// Public routes
	r.POST("/register", handlers.Register)
	r.POST("/login", handlers.Login)
	r.GET("/license/validate/:secretID", handlers.ValidateLicense)

	// Protected routes
	protected := r.Group("/license")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.POST("/register", handlers.RegisterLicense)
		protected.PUT("/renew/:id", handlers.RenewLicense)
		protected.DELETE("/delete/:id", handlers.DeleteLicense)
		protected.GET("/:id", handlers.GetLicenseInfo)
	}

	r.Run(":" + port)
}
