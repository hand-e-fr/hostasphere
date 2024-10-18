docker rm -f hostasphere-rest
docker build -t handoe/hostasphere-rest:latest .
docker run -v /var/run/docker.sock:/var/run/docker.sock -d --name hostasphere-rest -p 8080:8080 --network my_network -e MONGO_URI=mongodb://mongodb:27017 --restart unless-stopped handoe/hostasphere-rest:latest