@echo off
docker rm -f hostasphere-datasource
docker build -t handoe/hostasphere-datasource:latest .
docker run -d --name hostasphere-datasource -p 50051:50051 --network my_network -e MONGO_URI=mongodb://mongodb:27017 --restart unless-stopped handoe/hostasphere-datasource:latest