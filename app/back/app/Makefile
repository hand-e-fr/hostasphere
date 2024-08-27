BINARY_NAME=client_backend
SRC_DIR=./cmd/server
TEST_DIR=./internal/controllers
GO_FILES=$(shell find . -name '*.go' -not -path "./vendor/*")

all: build

build:
	@echo "Building the application..."
	@CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o $(BINARY_NAME) $(SRC_DIR)/main.go

test:
	@echo "Running unit tests..."
	@go test -v $(TEST_DIR)

clean:
	@echo "Cleaning up..."
	@rm -f $(BINARY_NAME)

fclean: clean
	@echo "Removing all generated files..."
	@go clean -testcache

re: fclean all

.PHONY: all build test clean fclean re