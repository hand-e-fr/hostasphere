docker stop mongodb
docker rm mongodb
docker volume rm mongodb_data
docker run -d --name mongodb -p 27017:27017 --network my_network --restart unless-stopped -v mongodb_data:/data/db mongo
cd app/back/datasource
./restart.sh
cd ..
cd rest
./restart.sh
cd ../../..
