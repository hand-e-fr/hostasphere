docker rm -f front
docker build -t handoe/hostasphere-front:latest .
docker run -d --name front -p 3000:3000 --network my_network --restart unless-stopped handoe/hostasphere-front:latest