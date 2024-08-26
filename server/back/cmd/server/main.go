package main

import (
	"log"
	"os"

	"back/internal/handlers"
	"back/internal/middleware"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := gin.Default()

	// Public routes
	r.POST("/register", handlers.Register)
	r.POST("/login", handlers.Login)

	// Protected routes
	protected := r.Group("/user")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.GET("/profile", handlers.Profile)
	}

	r.Run(":" + port)
}
