package main

import (
	"github.com/gin-gonic/gin"
	"myapp/internal/handlers"
	"myapp/internal/middleware"
)

func main() {
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

	r.Run(":8080")
}
