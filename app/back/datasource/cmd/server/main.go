/*
 * This file is part of the Hostasphere backend.
 * (c) 2024 Hostasphere <hostasphere.com>
 */

package main

import (
	"fmt"
	"github.com/joho/godotenv"
	"google.golang.org/grpc"
	"log"
	"net"
	"openHostaLogs/internal/db"
	"openHostaLogs/internal/profiler"
	"openHostaLogs/internal/session"
	"openHostaLogs/internal/token"
	"openHostaLogs/proto"
	"os"
	"strconv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	fmt.Println("Starting server...")
	fmt.Println(os.Getenv("MONGO_URI"))

	db.InitMongoDB()

	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	maxMsgSizeStr := os.Getenv("GRPC_MAX_MSG_SIZE")
	if maxMsgSizeStr == "" {
		log.Fatal("GRPC_MAX_MSG_SIZE environment variable not set")
	}

	maxMsgSize, err := strconv.Atoi(maxMsgSizeStr)
	if err != nil {
		log.Fatalf("Invalid GRPC_MAX_MSG_SIZE: %v", err)
	}

	// Create a new gRPC server with the specified max message size
	s := grpc.NewServer(
		grpc.MaxRecvMsgSize(maxMsgSize),
		grpc.MaxSendMsgSize(maxMsgSize),
	)
	proto.RegisterProfilerServer(s, &profiler.Server{})
	proto.RegisterTokenServiceServer(s, &token.Server{})
	proto.RegisterSessionServiceServer(s, &session.Server{})
	fmt.Println("gRPC server is running on port 50051")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
