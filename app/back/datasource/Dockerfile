FROM golang:1.22

WORKDIR /app

COPY . ./

RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

# Install protoc
RUN apt-get update && apt-get install -y protobuf-compiler

ENV PATH=$PATH:$GOPATH/bin

RUN make proto

RUN go mod download

RUN make

EXPOSE 50051

RUN chmod +x ./bin/server

CMD ["./bin/server"]