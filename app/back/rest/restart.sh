docker rm -f rest
docker build -t ghcr.io/hand-e-fr/hostasphere/rest:latest .
docker run -d --name rest -p 8080:8080 -e MONGO_URI=mongodb://mongodb:27017 --network my_network --restart unless-stopped ghcr.io/hand-e-fr/hostasphere/rest:latest