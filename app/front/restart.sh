docker build -t handoe/hostasphere-front:latest .
docker stop hostasphere-front
docker rm hostasphere-front
docker run -d --name hostasphere-front -p 3000:3000 --network my_network -e NEXT_PUBLIC_HS_REST_API_URL=http://localhost:8080 --restart unless-stopped handoe/hostasphere-front:latest