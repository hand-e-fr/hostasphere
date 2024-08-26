package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type License struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	UserID      primitive.ObjectID `bson:"user_id,omitempty"`
	Type        string             `json:"type" binding:"required"`
	Expiration  time.Time          `json:"expiration"`
	SecretID    string             `json:"secret_id"`
	Description string             `json:"description"`
}
