package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type License struct {
	ID       primitive.ObjectID `bson:"_id,omitempty"`
	SecretID string             `bson:"secret_id"`
}

type App struct {
	ID      primitive.ObjectID `bson:"_id,omitempty"`
	Name    string             `bson:"name"`
	License License            `bson:"license"`
}

type User struct {
	ID       primitive.ObjectID `bson:"_id,omitempty"`
	Email    string             `bson:"email"`
	FullName string             `bson:"full_name"`
	LastName string             `bson:"last_name"`
	Password string             `bson:"password"`
	IsAdmin  bool               `bson:"is_admin"`
}
