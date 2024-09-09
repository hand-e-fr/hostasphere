docker rm -f datasource
docker build -t ghcr.io/hand-e-fr/hostasphere/docker-datasource:latest .
docker run -d --name datasource -p 50051:50051 -e MONGO_URI=mongodb://mongodb:27017 --network my_network --restart unless-stopped ghcr.io/hand-e-fr/hostasphere/docker-datasource:latest
