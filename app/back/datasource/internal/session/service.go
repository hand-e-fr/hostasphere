package session

import (
	"context"
	config "openHostaLogs/internal/db"
	"openHostaLogs/internal/token"
	"openHostaLogs/proto"
)

type Server struct {
	proto.UnimplementedSessionServiceServer
}

func (s *Server) SaveSession(ctx context.Context, in *proto.SaveSessionRequest) (*proto.SaveSessionResponse, error) {
	if !(token.ValidToken(in.GetSession().GetTokenId())) {
		return &proto.SaveSessionResponse{Ok: false, Message: "Invalid token"}, nil
	}

	if len(in.GetSession().GetSessionTag()) == 0 {
		in.GetSession().SessionTag = in.GetSession().GetCurrentUser()
	}

	collection := config.GetCollection("sessions")
	_, err := collection.InsertOne(context.Background(), in.Session)
	if err != nil {
		return &proto.SaveSessionResponse{Ok: false, Message: "Failed to save profiler output"}, err
	}
	return &proto.SaveSessionResponse{Ok: true, Message: "Profiler output received"}, nil
}
