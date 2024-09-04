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
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	db.InitMongoDB()

	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	proto.RegisterProfilerServer(s, &profiler.Server{})
	proto.RegisterTokenServiceServer(s, &token.Server{})
	proto.RegisterSessionServiceServer(s, &session.Server{})
	fmt.Println("gRPC server is running on port 50051")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
