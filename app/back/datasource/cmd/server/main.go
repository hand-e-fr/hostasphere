/*
 * This file is part of the Hostasphere backend.
 * (c) 2024 Hostasphere <hostasphere.com>
 */

package main

import (
	"fmt"
	"google.golang.org/grpc"
	"log"
	"net"
	"openHostaLogs/internal/config"
	"openHostaLogs/internal/db"
	"openHostaLogs/internal/profiler"
	"openHostaLogs/internal/token"
	"openHostaLogs/proto"
)

func main() {
	config.Load()

	db.InitMongoDB()
	db.InitRedis()

	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	proto.RegisterProfilerServer(s, &profiler.Server{})
	proto.RegisterTokenServiceServer(s, &token.Server{})
	fmt.Println("gRPC server is running on port 50051")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
