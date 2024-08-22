package account

import (
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
	"openHostaLogs/internal/db"
	accountpb "openHostaLogs/protofile/account"
)

var jwtKey = []byte(os.Getenv("JWT_KEY"))

type Claims struct {
	Email string   `json:"email"`
	Roles []string `json:"roles"`
	jwt.RegisteredClaims
}

type Server struct {
	accountpb.UnimplementedAccountServiceServer
}

func (s *Server) CreateAccount(ctx context.Context, req *accountpb.CreateAccountRequest) (*accountpb.CreateAccountResponse, error) {
	if req.Username == "" || req.Email == "" || req.Password == "" {
		return nil, errors.New("username, email, and password are required")
	}

	collection := db.MongoClient.Database("accountDB").Collection("accounts")
	var account accountpb.Account
	err := collection.FindOne(ctx, bson.M{"email": req.Email}).Decode(&account)
	if err == nil {
		return nil, errors.New("email already registered")
	} else if !errors.Is(err, mongo.ErrNoDocuments) {
		return nil, err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	newAccount := &accountpb.Account{
		Id:            uuid.New().String(),
		Username:      req.Username,
		Email:         req.Email,
		Password:      string(hashedPassword),
		Roles:         req.Roles,
		Organizations: req.Organizations,
		CreatedAt:     time.Now().UnixMilli(),
	}

	if err := saveAccount(newAccount); err != nil {
		return nil, err
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Email: newAccount.Email,
		Roles: newAccount.Roles,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return nil, err
	}

	return &accountpb.CreateAccountResponse{Ok: true, Token: tokenString}, nil
}

func saveAccount(account *accountpb.Account) error {
	collection := db.MongoClient.Database("accountDB").Collection("accounts")
	_, err := collection.InsertOne(context.TODO(), bson.M{
		"id":            account.Id,
		"username":      account.Username,
		"email":         account.Email,
		"password":      account.Password,
		"roles":         account.Roles,
		"organizations": account.Organizations,
		"createdAt":     account.CreatedAt,
	})
	if err != nil {
		return err
	}
	return nil
}

func (s *Server) Login(ctx context.Context, req *accountpb.LoginRequest) (*accountpb.LoginResponse, error) {
	if req.Email == "" || req.Password == "" {
		return nil, errors.New("email and password are required")
	}

	var account accountpb.Account
	collection := db.MongoClient.Database("accountDB").Collection("accounts")
	err := collection.FindOne(ctx, bson.M{"email": req.Email}).Decode(&account)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return nil, errors.New("account not found")
	} else if err != nil {
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(account.Password), []byte(req.Password))
	if err != nil {
		return nil, errors.New("invalid password")
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Email: account.Email,
		Roles: account.Roles,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return nil, err
	}

	return &accountpb.LoginResponse{Ok: true, Token: tokenString}, nil
}

func (s *Server) ListAccount(ctx context.Context, req *accountpb.ListAccountRequest) (*accountpb.ListAccountResponse, error) {
	if req.Page < 1 || req.Limit < 1 || req.Limit > 100 {
		return nil, errors.New("page and limit must be greater than 0 and limit must be less than or equal to 100")
	}

	filter := bson.M{}
	if req.Query != "" {
		filter = bson.M{
			"$or": []bson.M{
				{"username": bson.M{"$regex": req.Query, "$findOptions": "i"}},
				{"email": bson.M{"$regex": req.Query, "$findOptions": "i"}},
			},
		}
	}

	findOptions := options.Find()
	findOptions.SetSkip(int64((req.Page - 1) * req.Limit))
	findOptions.SetLimit(int64(req.Limit))

	collection := db.MongoClient.Database("accountDB").Collection("accounts")
	cursor, err := collection.Find(ctx, filter, findOptions)
	if err != nil {
		return nil, err
	}
	defer func(cursor *mongo.Cursor, ctx context.Context) {
		err := cursor.Close(ctx)
		if err != nil {
			return
		}
	}(cursor, ctx)

	var accounts []*accountpb.Account
	for cursor.Next(ctx) {
		var account accountpb.Account
		if err := cursor.Decode(&account); err != nil {
			return nil, err
		}
		accounts = append(accounts, &account)
	}

	total, err := collection.CountDocuments(ctx, filter)
	if err != nil {
		return nil, err
	}

	return &accountpb.ListAccountResponse{
		Accounts: accounts,
		Total:    int32(total),
	}, nil
}

func (s *Server) DeleteAccount(ctx context.Context, req *accountpb.DeleteAccountRequest) (*accountpb.DeleteAccountResponse, error) {
	if req.Id == "" {
		return nil, errors.New("account ID is required")
	}

	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "missing metadata")
	}

	authHeader, ok := md["authorization"]
	if !ok || len(authHeader) == 0 {
		return nil, status.Errorf(codes.Unauthenticated, "missing authorization header")
	}

	tokenString := strings.TrimPrefix(authHeader[0], "Bearer ")
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		return nil, status.Errorf(codes.Unauthenticated, "invalid token")
	}

	collection := db.MongoClient.Database("accountDB").Collection("accounts")
	var account accountpb.Account
	err = collection.FindOne(ctx, bson.M{"id": req.Id}).Decode(&account)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return nil, errors.New("account not found")
	} else if err != nil {
		return nil, err
	}

	_, err = collection.DeleteOne(ctx, bson.M{"id": req.Id})
	if err != nil {
		return nil, err
	}

	return &accountpb.DeleteAccountResponse{Ok: true}, nil
}

func (s *Server) GetAccount(ctx context.Context, _ *accountpb.GetAccountRequest) (*accountpb.GetAccountResponse, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "missing metadata")
	}

	authHeader, ok := md["authorization"]
	if !ok || len(authHeader) == 0 {
		return nil, status.Errorf(codes.Unauthenticated, "missing authorization header")
	}

	tokenString := strings.TrimPrefix(authHeader[0], "Bearer ")
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		return nil, status.Errorf(codes.Unauthenticated, "invalid token")
	}

	collection := db.MongoClient.Database("accountDB").Collection("accounts")
	var account accountpb.Account
	err = collection.FindOne(ctx, bson.M{"email": claims.Email}).Decode(&account)

	if errors.Is(err, mongo.ErrNoDocuments) {
		return nil, errors.New("account not found")
	} else if err != nil {
		return nil, err
	}

	return &accountpb.GetAccountResponse{Account: &account}, nil
}

func (s *Server) UpdateAccount(ctx context.Context, req *accountpb.UpdateAccountRequest) (*accountpb.UpdateAccountResponse, error) {
	if req.Id == "" {
		return nil, errors.New("account ID is required")
	}

	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "missing metadata")
	}

	authHeader, ok := md["authorization"]
	if !ok || len(authHeader) == 0 {
		return nil, status.Errorf(codes.Unauthenticated, "missing authorization header")
	}

	tokenString := strings.TrimPrefix(authHeader[0], "Bearer ")
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		return nil, status.Errorf(codes.Unauthenticated, "invalid token")
	}

	collection := db.MongoClient.Database("accountDB").Collection("accounts")
	var account accountpb.Account
	err = collection.FindOne(ctx, bson.M{"id": req.Id}).Decode(&account)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return nil, errors.New("account not found")
	} else if err != nil {
		return nil, err
	}

	update := bson.M{}
	if req.Username != "" {
		update["username"] = req.Username
	}
	if req.Email != "" {
		update["email"] = req.Email
	}
	if req.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return nil, err
		}
		update["password"] = string(hashedPassword)
	}
	if req.Roles != nil {
		update["roles"] = req.Roles
	}
	if req.Organizations != nil {
		update["organizations"] = req.Organizations
	}

	_, err = collection.UpdateOne(ctx, bson.M{"id": req.Id}, bson.M{"$set": update})
	if err != nil {
		return nil, err
	}

	return &accountpb.UpdateAccountResponse{Ok: true}, nil
}

func (s *Server) AddRole(ctx context.Context, req *accountpb.AddRoleRequest) (*accountpb.UpdateAccountResponse, error) {
	if req.Id == "" || req.Role == "" {
		return nil, errors.New("account ID and role are required")
	}

	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "missing metadata")
	}

	authHeader, ok := md["authorization"]
	if !ok || len(authHeader) == 0 {
		return nil, status.Errorf(codes.Unauthenticated, "missing authorization header")
	}

	tokenString := strings.TrimPrefix(authHeader[0], "Bearer ")
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		return nil, status.Errorf(codes.Unauthenticated, "invalid token")
	}

	// Check if the user has admin role
	if !contains(claims.Roles, "admin") {
		return nil, status.Errorf(codes.PermissionDenied, "admin role required")
	}

	collection := db.MongoClient.Database("accountDB").Collection("accounts")
	var account accountpb.Account
	err = collection.FindOne(ctx, bson.M{"id": req.Id}).Decode(&account)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return nil, errors.New("account not found")
	} else if err != nil {
		return nil, err
	}

	// Add the new role to the account
	account.Roles = append(account.Roles, req.Role)

	_, err = collection.UpdateOne(ctx, bson.M{"id": req.Id}, bson.M{"$set": bson.M{"roles": account.Roles}})
	if err != nil {
		return nil, err
	}

	return &accountpb.UpdateAccountResponse{Ok: true}, nil
}

func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}
