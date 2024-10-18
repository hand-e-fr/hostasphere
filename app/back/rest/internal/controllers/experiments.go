package controllers

import (
	"bufio"
	"context"
	"fmt"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/gin-gonic/gin"
	"io"
)

func ExperimentsExecute(c *gin.Context) {
	code := c.PostForm("code")

	ctx := context.Background()
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		c.String(500, "Error creating Docker client: %v", err)
		return
	}

	resp, err := cli.ContainerCreate(ctx,
		&container.Config{
			Image: "python:3.9-slim",
			Cmd:   []string{"python", "-c", code},
		},
		nil, nil, nil, "")
	if err != nil {
		c.String(500, "Error creating container: %v", err)
		return
	}

	if err := cli.ContainerStart(ctx, resp.ID, container.StartOptions{}); err != nil {
		c.String(500, "Error starting container: %v", err)
		return
	}

	out, err := cli.ContainerLogs(ctx, resp.ID, container.LogsOptions{ShowStdout: true, ShowStderr: true, Follow: true})
	if err != nil {
		c.String(500, "Error getting container logs: %v", err)
		return
	}

	c.Stream(func(w io.Writer) bool {
		scanner := bufio.NewScanner(out)
		for scanner.Scan() {
			fmt.Fprintf(w, "%s\n", scanner.Text())
		}
		return false
	})

	err = cli.ContainerRemove(ctx, resp.ID, container.RemoveOptions{Force: true})
	if err != nil {
		c.String(500, "Error removing container: %v", err)
		return
	}
}
