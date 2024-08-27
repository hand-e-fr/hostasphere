docker rm -f hostasphere.client.api
docker build -t hostasphere/client/api:latest .
docker run -d --name hostasphere.client.api -p 8080:8080 --network my_network hostasphere/client/api