@echo off
docker rm -f front
docker build -t ghcr.io/hand-e-fr/hostasphere/rest:latest .
docker run -d --name front -p 3000:3000 --network my_network --restart unless-stopped ghcr.io/hand-e-fr/hostasphere/rest:latest