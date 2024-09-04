docker rm -f hostasphere.client.front
docker build -t hostasphere/client/front:latest .
docker run -d --name hostasphere.client.front -p 3000:3000 hostasphere/client/front