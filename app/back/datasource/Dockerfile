FROM golang:1.22
LABEL org.opencontainers.image.title="Datasource"
LABEL org.opencontainers.image.description="Datasource service for Hostasphere, used to push data to the database with hostashphere-profiler api"
LABEL org.opencontainers.image.authors="Hand-e"
LABEL org.opencontainers.image.source='https://github.com/hand-e-fr/hostasphere'
LABEL org.opencontainers.image.url='https://github.com/hand-e-fr/hostasphere'

WORKDIR /app

COPY go.mod go.sum ./

RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

# Install protoc
RUN apt-get update && apt-get install -y protobuf-compiler

ENV PATH=$PATH:$GOPATH/bin

COPY . .

RUN make proto

RUN go mod download

RUN make

EXPOSE 50051

RUN chmod +x ./bin/server

CMD ["./bin/server"]