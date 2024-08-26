package routes

import (
	"app/internal/controllers"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	api := r.Group("/api")
	{
		api.POST("/login", controllers.Login)
		api.POST("/register/app", controllers.RegisterApp)
		api.POST("/register/user", controllers.RegisterUser)
		api.GET("/app/:id", controllers.GetApp)
		api.PUT("/app/:id", controllers.UpdateApp)
		api.PUT("/user/:id", controllers.UpdateUser)
		api.DELETE("/user/:id", controllers.DeleteUser)
		api.PUT("/app/:id/license", controllers.UpdateLicense)
	}

	return r
}
