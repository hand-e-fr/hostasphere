package controllers

import (
	"app/internal/config"
	"app/internal/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"net/http"
	"strings"
)

func FetchProfilerData(c *gin.Context) {
	claim, err := utils.GetTokenValue(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	if !claim.IsAdmin /* || todo check if he is the token owner*/ {
		c.JSON(http.StatusForbidden, gin.H{"error": "you are not authorized to access this resource"})
		return
	}

	tokenID := c.Query("tokenid")
	sortFields := c.Query("sort")
	name := c.Query("name")
	id := c.Query("id")

	if tokenID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "tokenid query parameter is required"})
		return
	}

	// Initialize context from the request
	ctx := c.Request.Context()

	filter := bson.M{"tokenid": tokenID}

	if name != "" {
		filter["name"] = name
	}

	if id != "" {
		filter["id"] = id
	}

	findOptions := options.Find()
	if sortFields != "" {
		sortOptions := bson.D{}
		fields := strings.Split(sortFields, ",")
		for _, field := range fields {
			sortOrder := 1
			if field[0] == '-' {
				sortOrder = -1
				field = field[1:]
			}
			sortOptions = append(sortOptions, bson.E{Key: field, Value: sortOrder})
		}
		findOptions.SetSort(sortOptions)
	}

	cursor, err := config.GetCollection("profiler").Find(ctx, filter, findOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var results []bson.M
	if err = cursor.All(ctx, &results); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, results)
}
