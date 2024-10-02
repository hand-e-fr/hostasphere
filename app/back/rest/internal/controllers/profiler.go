package controllers

import (
	"app/internal/config"
	"app/internal/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"net/http"
	"os"
	"strconv"
	"strings"
)

func FetchProfilerData(c *gin.Context) {
	claim, err := utils.GetTokenValue(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	tokenID := c.Query("tokenid")

	if tokenID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "tokenid query parameter is required"})
		return
	}

	if !claim.IsAdmin && !utils.IsTokenOwner(tokenID, claim.Email) {
		c.JSON(http.StatusForbidden, gin.H{"error": "you are not authorized to access this resource"})
		return
	}

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

func GetSessions(c *gin.Context) {
	claim, err := utils.GetTokenValue(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	if !claim.IsAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "you are not authorized to access this resource"})
		return
	}

	// Extract query parameters
	sortBy := c.Query("sortby")
	limitStr := c.Query("limit")
	pageStr := c.Query("page")

	// Set default values for limit and page
	limit := int64(0)
	page := int64(0)

	if limitStr != "" {
		limit, err = strconv.ParseInt(limitStr, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid limit parameter"})
			return
		}
	}

	if pageStr != "" {
		page, err = strconv.ParseInt(pageStr, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid page parameter"})
			return
		}
	}

	// Initialize context from the request
	ctx := c.Request.Context()

	// Set options for sorting, limit, and skip
	findOptions := options.Find()
	if sortBy != "" {
		sortOrder := 1
		if sortBy[0] == '-' {
			sortOrder = -1
			sortBy = sortBy[1:]
		}
		findOptions.SetSort(bson.D{{Key: sortBy, Value: sortOrder}})
	}

	if limit > 0 {
		findOptions.SetLimit(limit)
		findOptions.SetSkip(page * limit)
	}

	// Fetch sessions from the "sessions" collection
	cursor, err := config.GetCollection("sessions").Find(ctx, bson.M{}, findOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var sessions []bson.M
	if err = cursor.All(ctx, &sessions); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, sessions)
}

func FetchSessionData(c *gin.Context) {
	claim, err := utils.GetTokenValue(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	tokenID := c.Query("tokenid")
	if tokenID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "tokenid query parameter is required"})
		return
	}

	if !claim.IsAdmin && !utils.IsTokenOwner(tokenID, claim.Email) {
		c.JSON(http.StatusForbidden, gin.H{"error": "you are not authorized to access this resource"})
		return
	}

	sessionUUID := c.Query("sessionuuid")
	sessionTag := c.Query("sessiontag")

	if sessionUUID == "" && sessionTag == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "either sessionuuid or sessiontag query parameter is required"})
		return
	}

	// Initialize context from the request
	ctx := c.Request.Context()

	// Build the filter for the session query
	sessionFilter := bson.M{}
	sessionFilter["tokenid"] = tokenID
	if sessionUUID != "" {
		sessionFilter["sessionuuid"] = sessionUUID
	} else if sessionTag != "" {
		sessionFilter["sessiontag"] = sessionTag
	}

	// Fetch the session from the "sessions" collection
	var session bson.M
	err = config.GetCollection("sessions").FindOne(ctx, sessionFilter).Decode(&session)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "session not found"})
		return
	}

	// Extract the sessionuuid for fetching related functions
	sessionUUID = session["sessionuuid"].(string)

	// Fetch related functions from the "profiler" collection
	profilerFilter := bson.M{"sessionuuid": sessionUUID}
	cursor, err := config.GetCollection("profiler").Find(ctx, profilerFilter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var functions []bson.M
	if err = cursor.All(ctx, &functions); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Combine session and functions into the response
	response := gin.H{
		"session":   session,
		"functions": functions,
	}

	c.JSON(http.StatusOK, response)
}

func GroupSessions(c *gin.Context) {
	claim, err := utils.GetTokenValue(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	tokenID := c.Query("tokenid")
	if tokenID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "tokenid query parameter is required"})
		return
	}

	if !claim.IsAdmin && !utils.IsTokenOwner(tokenID, claim.Email) {
		c.JSON(http.StatusForbidden, gin.H{"error": "you are not authorized to access this resource"})
		return
	}

	groupBy := c.Query("groupby")
	if groupBy == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "groupby query parameter is required"})
		return
	}

	// Extract pagination parameters
	limitStr := c.Query("limit")
	pageStr := c.Query("page")

	// Set default values for limit and page
	limit := int64(0)
	page := int64(0)

	if limitStr != "" {
		limit, err = strconv.ParseInt(limitStr, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid limit parameter"})
			return
		}
	}

	if pageStr != "" {
		page, err = strconv.ParseInt(pageStr, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid page parameter"})
			return
		}
	}

	// Initialize context from the request
	ctx := c.Request.Context()

	var groupStage bson.D

	projectStage := bson.D{
		{"$project", bson.D{
			{"_id", 1},
			{"tokenid", 1},
			{"sessionuuid", 1},
			{"startdate", 1},
			{"sessiontag", 1},
			{"executiontime", 1},
		}},
	}

	switch groupBy {
	case "hour":
		groupStage = bson.D{
			{"$group", bson.D{
				{"_id", bson.D{
					{"$dateToString", bson.D{
						{"timezone", os.Getenv("TIMEZONE")},
						{"format", "%Y-%m-%d %H:%M"},
						{"date", bson.D{{"$toDate", "$startdate"}}},
					}},
				}},
				{"sessions", bson.D{{"$push", "$$ROOT"}}},
			}},
		}
	case "day":
		groupStage = bson.D{
			{"$group", bson.D{
				{"_id", bson.D{
					{"$dateToString", bson.D{
						{"timezone", os.Getenv("TIMEZONE")},
						{"format", "%Y-%m-%d"},
						{"date", bson.D{{"$toDate", "$startdate"}}},
					}},
				}},
				{"sessions", bson.D{{"$push", "$$ROOT"}}},
			}},
		}
	case "week":
		groupStage = bson.D{
			{"$group", bson.D{
				{"_id", bson.D{
					{"year", bson.D{{"$isoWeekYear", bson.D{{"$toDate", "$startdate"}}}}},
					{"week", bson.D{{"$isoWeek", bson.D{{"$toDate", "$startdate"}}}}},
				}},
				{"sessions", bson.D{{"$push", "$$ROOT"}}},
			}},
		}
	case "tag":
		groupStage = bson.D{
			{"$group", bson.D{
				{"_id", "$sessiontag"},
				{"sessions", bson.D{{"$push", "$$ROOT"}}},
			}},
		}
	case "all":
		groupStage = bson.D{
			{"$group", bson.D{
				{"_id", nil},
				{"sessions", bson.D{{"$push", "$$ROOT"}}},
			}},
		}
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid groupby parameter"})
		return
	}

	// Create the aggregation pipeline
	pipeline := mongo.Pipeline{
		{{"$match", bson.M{"tokenid": tokenID}}},
		projectStage,
		groupStage,
	}

	// Add pagination stages if a limit is set
	if limit > 0 {
		skip := page * limit
		pipeline = append(pipeline, bson.D{{"$skip", skip}})
		pipeline = append(pipeline, bson.D{{"$limit", limit}})
	}

	cursor, err := config.GetCollection("sessions").Aggregate(ctx, pipeline)
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

/*
** CompareSessions compares two sessions based on the sessionuuids provided in the query parameters.
 */
func CompareSessions(c *gin.Context) {
	claim, err := utils.GetTokenValue(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	tokenID := c.Query("tokenid")
	if tokenID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "tokenid query parameter is required"})
		return
	}

	if !claim.IsAdmin && !utils.IsTokenOwner(tokenID, claim.Email) {
		c.JSON(http.StatusForbidden, gin.H{"error": "you are not authorized to access this resource"})
		return
	}

	sessionUUID1 := c.Query("sessionuuid1")
	sessionUUID2 := c.Query("sessionuuid2")

	if sessionUUID1 == "" || sessionUUID2 == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "sessionuuid1 and sessionuuid2 query parameters are required"})
		return
	}

	// Initialize context from the request
	ctx := c.Request.Context()

	// Fetch the sessions from the "sessions" collection
	sessionFilter := bson.M{"tokenid": tokenID, "sessionuuid": bson.M{"$in": []string{sessionUUID1, sessionUUID2}}}
	cursor, err := config.GetCollection("sessions").Find(ctx, sessionFilter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var sessions []bson.M
	if err = cursor.All(ctx, &sessions); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Fetch the functions for each session from the "profiler" collection
	profilerFilter := bson.M{"sessionuuid": bson.M{"$in": []string{sessionUUID1, sessionUUID2}}}
	cursor, err = config.GetCollection("profiler").Find(ctx, profilerFilter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var functions []bson.M
	if err = cursor.All(ctx, &functions); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Combine sessions and functions into the response
	response := gin.H{
		"sessions":  sessions,
		"functions": functions,
	}

	c.JSON(http.StatusOK, response)
}
