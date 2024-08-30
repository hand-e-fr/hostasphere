package profiler

import (
	"context"
	config "openHostaLogs/internal/db"
	"openHostaLogs/internal/token"
	"openHostaLogs/proto"
)

type Server struct {
	proto.UnimplementedProfilerServer
}

func (s *Server) SendProfilerOutput(ctx context.Context, in *proto.ProfilerOutputRequest) (*proto.Response, error) {
	if !(token.ValidToken(in.GetProfilerOutput().GetTokenId())) {
		return &proto.Response{Ok: false, Message: "Invalid token"}, nil
	}

	collection := config.GetCollection("profiler")
	_, err := collection.InsertOne(context.Background(), in.ProfilerOutput)
	if err != nil {
		return &proto.Response{Ok: false, Message: "Failed to save profiler output"}, err
	}
	return &proto.Response{Ok: true, Message: "Profiler output received"}, nil
}
