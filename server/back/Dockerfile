FROM golang:1.22 AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main cmd/server/main.go

FROM alpine:latest

WORKDIR /root/

COPY --from=builder /app/main .

COPY --from=builder /app/.env .

EXPOSE $PORT

RUN chmod +x main

CMD ["./main"]