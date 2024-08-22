GO=go

PROTOC=protoc

PROTO_DIR=protofile

OUT_DIR=.

PROTO_FILES=$(shell find $(PROTO_DIR) -name "*.proto")

all: build

build:
	$(GO) build -o bin/server cmd/server/main.go

proto:
	$(PROTOC) --go_out=$(OUT_DIR) --go-grpc_out=$(OUT_DIR) $(PROTO_FILES)

clean:
	rm -f bin/server
	find . -name "*.pb.go" -delete