package utils

import (
	"app/internal/config"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
)

func GenerateToken() (string, error) {
	prefix := "hsp_"
	tokenLength := 32

	randomBytes := make([]byte, tokenLength)
	if _, err := rand.Read(randomBytes); err != nil {
		return "", fmt.Errorf("failed to generate random bytes: %w", err)
	}

	randomString := hex.EncodeToString(randomBytes)
	token := prefix + randomString
	return token, nil
}

func IsTokenOwner(tokenID string, ownerMail string) bool {
	collection := config.GetCollection("tokens")
	filter := bson.M{"value": tokenID}
	var result bson.M
	err := collection.FindOne(nil, filter).Decode(&result)
	if err != nil {
		return false
	}
	return result["owner"] == ownerMail
}
