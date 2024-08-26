/*
 * This file is part of the Hostasphere backend.
 * (c) 2024 Hostasphere <hostasphere.com>
 */

package github

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	accountpb "openHostaLogs/protofile/account"
)

type Server struct {
	accountpb.UnimplementedGithubAccountServiceServer
}

type GitHubTokenResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	Scope       string `json:"scope"`
}

func (s *Server) CreateGithubAccount(_ context.Context, req *accountpb.CreateGithubAccountRequest) (*accountpb.CreateGithubAccountResponse, error) {
	println("Received a GitHub account creation request")
	code := req.GetCode()
	clientID := os.Getenv("GITHUB_CLIENT_ID")
	clientSecret := os.Getenv("GITHUB_CLIENT_SECRET")

	url := fmt.Sprintf("https://github.com/login/oauth/access_token?client_id=%s&client_secret=%s&code=%s", clientID, clientSecret, code)
	req2, err := http.NewRequest("POST", url, nil)
	if err != nil {
		return &accountpb.CreateGithubAccountResponse{Ok: false}, status.Errorf(codes.Internal, "failed to create request: %v", err)
	}
	req2.Header.Set("Accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req2)
	if err != nil {
		return &accountpb.CreateGithubAccountResponse{Ok: false}, status.Errorf(codes.Internal, "failed to send request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return &accountpb.CreateGithubAccountResponse{Ok: false}, status.Errorf(codes.Internal, "GitHub API returned non-200 status: %v", resp.Status)
	}

	var tokenResponse GitHubTokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&tokenResponse); err != nil {
		return &accountpb.CreateGithubAccountResponse{Ok: false}, status.Errorf(codes.Internal, "failed to decode response: %v", err)
	}

	if tokenResponse.AccessToken == "" {
		return &accountpb.CreateGithubAccountResponse{Ok: false}, status.Errorf(codes.Internal, "failed to retrieve access token")
	}

	return &accountpb.CreateGithubAccountResponse{Ok: true, Token: tokenResponse.AccessToken}, nil
}
