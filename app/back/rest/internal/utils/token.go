package utils

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
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
