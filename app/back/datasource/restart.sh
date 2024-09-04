docker rm -f hostasphere.client.datasource
docker build -t hostasphere/client/datasource:latest .
docker run -d --name hostasphere.client.datasource -p 50051:50051 --network my_network hostasphere/client/datasource