package models

import (
	"errors"
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
	ID                  primitive.ObjectID `bson:"_id,omitempty"`
	Email               string             `bson:"email"`
	FirstName           string             `bson:"first_name"`
	LastName            string             `bson:"last_name"`
	Password            string             `bson:"password"`
	IsAdmin             bool               `bson:"is_admin"`
	NeedsPasswordChange bool               `bson:"needs_password_change"`
	CreatedAt           int64              `bson:"created_at"`
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

var ErrUserExists = errors.New("user already exists")
var ErrInvalidInput = errors.New("invalid input")
