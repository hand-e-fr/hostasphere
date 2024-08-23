/*
 * This file is part of the Hostasphere backend.
 * (c) 2024 Hostasphere <hostasphere.com>
 */

package db

import (
	"os"

	"github.com/go-redis/redis/v8"
)

var RedisClient *redis.Client

func InitRedis() {
	RedisClient = redis.NewClient(&redis.Options{
		Addr: os.Getenv("REDIS_ADDR"),
	})
}
