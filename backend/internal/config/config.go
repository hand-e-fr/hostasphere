/*
 * This file is part of the Hostasphere backend.
 * (c) 2024 Hostasphere <hostasphere.com>
 */

package config

import (
	"github.com/joho/godotenv"
	"log"
)

func Load() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}
}
