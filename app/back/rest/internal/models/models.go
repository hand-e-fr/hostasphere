package models

import (
	"errors"
	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type License struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	SecretID string             `bson:"secret_id" json:"secret"`
}

type App struct {
	ID      primitive.ObjectID `bson:"_id,omitempty"`
	Name    string             `bson:"name"`
	License License            `bson:"license"`
}

type User struct {
	ID                  primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Email               string             `bson:"email" json:"email"`
	FirstName           string             `bson:"first_name" json:"first_name"`
	LastName            string             `bson:"last_name" json:"last_name"`
	Password            []byte             `bson:"password" json:"-"`
	IsAdmin             bool               `bson:"is_admin" json:"is_admin"`
	SuperAdmin          bool               `bson:"super_admin" json:"super_admin"`
	NeedsPasswordChange bool               `bson:"needs_password_change" json:"needs_password_change"`
	CreatedAt           int64              `bson:"created_at" json:"created_at"`
}

type RegisterUserRequest struct {
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Password  string `json:"password"`
}

type RegisterAppRequest struct {
	Name      string              `json:"name"`
	License   License             `json:"license"`
	AdminUser RegisterUserRequest `json:"admin_user"`
}

type Claims struct {
	Id                  string `json:"id"`
	Email               string `json:"email"`
	IsAdmin             bool   `json:"is_admin"`
	NeedsPasswordChange bool   `json:"needs_password_change"`
	jwt.StandardClaims
}

type Token struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name           string             `bson:"name" json:"name"`
	Value          []byte             `bson:"value" json:"-"`
	DisplayedValue string             `bson:"displayed_value" json:"value"`
	CreatedAt      int64              `bson:"created_at" json:"created_at"`
	LastUsed       int64              `bson:"last_used" json:"last_used"`
	Owner          string             `bson:"owner" json:"owner"`
}

type LLMPrice struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Model       string             `bson:"model" json:"model"`
	InputPrice  float64            `bson:"input_price" json:"input_price"`
	OutputPrice float64            `bson:"output_price" json:"output_price"`
	UpdateAt    int64              `bson:"update_at" json:"update_at"`
}

var ErrUserExists = errors.New("user already exists")
var ErrInvalidInput = errors.New("invalid input")
