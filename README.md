# ![hostasphere](https://avatars.githubusercontent.com/u/164780978?s=30 "logo") hand-e.fr

## Hostasphere

### Installation

Installation example on Docker with mongoDB network:

#### Install the mongoDB network:
```bash
docker network create my_network
```
```bash
docker run -d --name mongodb -p 27017:27017 --network my_network --restart unless-stopped -v mongodb_data:/data/db mongo
```

#### Pull the images:
If you are not logged in, you can use the following command:
```bash
docker login
```

Then pull the images:
front:
```bash
docker pull handoe/hostasphere-front:latest
```
rest:
```bash
docker pull handoe/hostasphere-rest:latest
```
datasource:
```bash
docker pull handoe/hostasphere-datasource:latest
```

#### Run the containers:
front:
```bash
docker run -d --name front -p 3000:3000 --network my_network --restart unless-stopped handoe/hostasphere-front:latest
```
rest:
```bash
docker run -d --name rest -p 8080:8080 --network my_network -e MONGO_URI=mongodb://mongodb:27017 --restart unless-stopped handoe/hostasphere-rest:latest
```
datasource:
```bash
docker run -d --name datasource -p 50051:50051 --network my_network -e MONGO_URI=mongodb://mongodb:27017 --restart unless-stopped handoe/hostasphere-datasource:latest
```
You can now access the front at `http://localhost:3000` and the rest at `http://localhost:8080`.
The datasource is not accessible from the browser, it is used by client api to pull data.

If you need to change ports, you can do it by changing the `-p` parameter in the `docker run` command.
And if you need to change the network name, you can do it by changing the `--network` parameter in the `docker run` command.
The `--restart unless-stopped` parameter will restart the container if it stops.

#### Stop the containers:
```bash
docker stop rest datasource front
```

#### Remove the containers:
```bash
docker rm rest datasource front
```

#### Environment variables:
##### REST:
- `MONGO_URI`: URI of the mongoDB, default is `mongodb://localhost:27017`
- `MONGO_DB`: Name of the mongoDB database, default is `hostasphere`
- `JWT_SECRET`: Secret used to sign the JWT, default
- `TOKEN_SALT`: Salt used to hash the JWT, default is `salt`
- `TIMEZONE`: Timezone used to display dates, default is `Europe/Paris`
##### DATASOURCE:
- `MONGO_URI`: URI of the mongoDB, default is `mongodb://localhost:27017`
- `MONGO_DB`: Name of the mongoDB database, default is `hostasphere`
- `GRPC_MAX_MSG_SIZE`: Maximum size of the message, default is `16MB`
##### FRONT:
- `NEXT_PUBLIC_HS_REST_API_URL`: URL of the REST API, default is `http://localhost:8080`


### Push profiler data to the REST API

#### Python3 API:
Ressource: [Python3 API](https://github.com/hand-e-fr/hostasphere/tree/main/api/python3)
