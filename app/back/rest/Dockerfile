FROM golang:1.22 AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN make build

FROM alpine:latest

WORKDIR /root/

COPY --from=builder /app/client_backend .

COPY --from=builder /app/.env .

ENV DOCKER_CLI_EXPERIMENTAL=enabled

RUN apk add --no-cache docker-cli

EXPOSE 8080

RUN chmod +x client_backend

CMD ["./client_backend"]