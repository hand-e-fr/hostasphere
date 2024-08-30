package token

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
	"openHostaLogs/internal/db"
	"openHostaLogs/internal/models"
	pb "openHostaLogs/proto"
)

type Server struct {
	pb.TokenServiceServer
}

func ValidToken(tokenId string) bool {
	collection := db.GetCollection("tokens")
	if collection == nil {
		return false
	}

	// tokenID to ObjectID
	var oid primitive.ObjectID
	var err error
	if oid, err = primitive.ObjectIDFromHex(tokenId); err != nil {
		return false
	}

	var token models.Token
	err = collection.FindOne(context.Background(), bson.M{"_id": oid}).Decode(&token)
	if err != nil {
		return false
	}

	return true
}

func (s *Server) ExistsToken(ctx context.Context, req *pb.ExistsTokenRequest) (*pb.ExistsTokenResponse, error) {
	tokenValue := req.GetToken()

	collection := db.GetCollection("tokens")
	if collection == nil {
		return nil, nil
	}

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var tokens []models.Token
	if err := cursor.All(ctx, &tokens); err != nil {
		return nil, err
	}

	for _, token := range tokens {
		err := bcrypt.CompareHashAndPassword(token.Value, []byte(tokenValue))
		if err == nil {
			return &pb.ExistsTokenResponse{Exists: true, Id: token.ID.Hex()}, nil
		}
	}

	return &pb.ExistsTokenResponse{Exists: false}, nil
}
