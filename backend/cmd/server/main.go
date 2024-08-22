package main

import (
	"fmt"
	"google.golang.org/grpc"
	"log"
	"net"
	"openHostaLogs/internal/account"
	"openHostaLogs/internal/account/github"
	"openHostaLogs/internal/config"
	"openHostaLogs/internal/db"
	log2 "openHostaLogs/internal/log"
	accountpb "openHostaLogs/protofile/account"
	logpb "openHostaLogs/protofile/log"
)

func main() {
	config.Load() // Load environment variables

	db.InitMongoDB()
	db.InitRedis()

	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	logpb.RegisterLogServiceServer(s, &log2.Server{})
	accountpb.RegisterAccountServiceServer(s, &account.Server{})
	accountpb.RegisterGithubAccountServiceServer(s, &github.Server{})
	fmt.Println("gRPC server is running on port 50051")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
