FROM golang:1.22 AS datasource_builder

WORKDIR /app

COPY datasource/go.mod datasource/go.sum ./

RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

RUN apt-get update && apt-get install -y protobuf-compiler

ENV PATH=$PATH:$GOPATH/bin

COPY datasource/ .

RUN make proto

RUN go mod download

RUN make


FROM golang:1.22 AS rest_builder

WORKDIR /app

COPY rest/go.mod rest/go.sum ./

RUN go mod download

COPY rest/ .

RUN make build


FROM alpine:latest

WORKDIR /root/

COPY --from=datasource_builder rest/bin/server ./datasource_server

#COPY --from=rest_builder rest/client_backend ./client_backend

#COPY --from=rest_builder rest/.env ./

EXPOSE 8080 50051

RUN chmod +x datasource_server client_backend

COPY start_services.sh /root/start_services.sh
RUN chmod +x /root/start_services.sh

CMD ["/root/start_services.sh"]