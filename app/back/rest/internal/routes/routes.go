package routes

import (
	"app/internal/controllers"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}                                                 // Allow all origins
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}                      // Allow specific methods
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"} // Allow specific headers

	r.Use(cors.New(config))

	//r.Use(middleware.LicenseValidationMiddleware())

	api := r.Group("/api")
	{
		api.POST("/register/app", controllers.RegisterApp)
		api.GET("/app", controllers.GetApp)
		api.PUT("/app", controllers.UpdateApp)

		api.POST("/login", controllers.Login)
		api.POST("/login/first-connect", controllers.FirstConnection)
		api.GET("/login/test", controllers.CheckToken)
		api.POST("/register/user", controllers.RegisterUser)

		api.PUT("/user/change-password", controllers.ChangePasswordRoute)
		api.PUT("/user/:id", controllers.UpdateUserRoute)
		api.DELETE("/user/:id", controllers.DeleteUserRoute)
		api.GET("/user", controllers.GetUserByEmailRoute)
		api.GET("/user/:id", controllers.GetUserByIDRoute)
		api.GET("/users", controllers.GetUsersRoute)
		api.PUT("/app/:id/license", controllers.UpdateLicense)

		api.POST("/token", controllers.CreateToken)
		api.GET("/tokens", controllers.GetTokens)
		api.GET("/token/:token", controllers.ExistsToken)
		api.DELETE("/token/:token", controllers.DeleteToken)
		api.GET("/token/:token/name", controllers.TokenNameFromId)

		api.GET("/profiler", controllers.FetchProfilerData)
		api.GET("/profiler/session", controllers.FetchSessionData)
		api.GET("/profiler/sessions", controllers.GetSessions)
		api.GET("/profiler/group-sessions", controllers.GroupSessions)
		api.GET("/profiler/compare-sessions", controllers.CompareSessions)
	}

	r.GET("/api/app/isInitialized", controllers.IsAppInitialized)

	r.GET("/api/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	return r
}
