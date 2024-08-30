package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Token struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name           string             `bson:"name" json:"name"`
	Value          []byte             `bson:"value" json:"-"`
	DisplayedValue string             `bson:"displayed_value" json:"value"`
	CreatedAt      int64              `bson:"created_at" json:"created_at"`
	LastUsed       int64              `bson:"last_used" json:"last_used"`
	Owner          string             `bson:"owner" json:"owner"`
}
