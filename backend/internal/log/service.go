package log

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"openHostaLogs/internal/db"
	logpb "openHostaLogs/protofile/log"
)

type Server struct {
	logpb.UnimplementedLogServiceServer
}

func hashPrompt(prompt string) string {
	hash := sha256.New()
	hash.Write([]byte(prompt))
	return hex.EncodeToString(hash.Sum(nil))
}

func (s *Server) SendLogRequest(ctx context.Context, req *logpb.LogRequest) (*logpb.LogResponse, error) {
	fmt.Println("Received a log request")

	id := req.GetId()
	prompt := req.GetPrompt()
	response := req.GetResponse()
	date := time.Now()

	hashedPrompt := hashPrompt(prompt)

	redisKey := fmt.Sprintf("log:%s", hashedPrompt)
	logValue := fmt.Sprintf(`{"id": "%d", "prompt": "%s", "response": "%s", "date": "%s"}`, id, prompt, response, date.Format(time.RFC3339))
	err := db.RedisClient.Set(ctx, redisKey, logValue, 7*24*time.Hour).Err()
	if err != nil {
		return &logpb.LogResponse{Ok: false}, status.Errorf(codes.Internal, "failed to save log to Redis: %v", err)
	}

	collection := db.MongoClient.Database("logsDB").Collection("logs")
	_, err = collection.InsertOne(ctx, bson.D{{"id", id}, {"prompt", prompt}, {"response", response}, {"date", date}})
	if err != nil {
		return &logpb.LogResponse{Ok: false}, status.Errorf(codes.Internal, "failed to save log to MongoDB: %v", err)
	}

	return &logpb.LogResponse{Ok: true}, nil
}
