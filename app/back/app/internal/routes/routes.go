package routes

import (
	"app/internal/controllers"
	"app/internal/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// Apply the license validation middleware to all routes
	r.Use(middleware.LicenseValidationMiddleware())

	api := r.Group("/api")
	{
		api.POST("/login", controllers.Login)
		api.POST("/register/app", controllers.RegisterApp)
		api.POST("/register/user", controllers.RegisterUser)
		api.PUT("/user/change-password", controllers.ChangePassword)
		api.GET("/app/:id", controllers.GetApp)
		api.PUT("/app/:id", controllers.UpdateApp)
		api.PUT("/user/:id", controllers.UpdateUser)
		api.DELETE("/user/:id", controllers.DeleteUser)
		api.PUT("/app/:id/license", controllers.UpdateLicense)
	}

	return r
}
