FROM golang:1.22 AS builder
LABEL org.opencontainers.image.title="RestAPI"
LABEL org.opencontainers.image.description="RestAPI, used by hostasphere frontend"
LABEL org.opencontainers.image.authors="Hand-e"
LABEL org.opencontainers.image.source='https://github.com/hand-e-fr/hostasphere'
LABEL org.opencontainers.image.url='https://github.com/hand-e-fr/hostasphere'

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN make build

FROM alpine:latest

WORKDIR /root/

COPY --from=builder /app/client_backend .

COPY --from=builder /app/.env .

EXPOSE 8080

RUN chmod +x client_backend

CMD ["./client_backend"]