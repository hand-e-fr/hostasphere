package controllers

import (
	"app/internal/controllers"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestIsAppInitialized(t *testing.T) {
	// Set Gin to Test Mode
	gin.SetMode(gin.TestMode)

	// Create a new Gin router
	router := gin.Default()
	router.GET("/api/app/isInitialized", controllers.IsAppInitialized)

	// Create a new HTTP request
	req, err := http.NewRequest(http.MethodGet, "/api/app/isInitialized", nil)
	assert.NoError(t, err)

	// Create a response recorder
	rr := httptest.NewRecorder()

	// Perform the request
	router.ServeHTTP(rr, req)

	// Check the status code
	assert.Equal(t, http.StatusOK, rr.Code)

	// Check the response body
	expected := `{"isInitialized":true}`
	assert.JSONEq(t, expected, rr.Body.String())
}
