# ![hostasphere](https://avatars.githubusercontent.com/u/164780978?s=30 "logo") hand-e.fr

## Hostasphere

### Installation

Installation example on Docker with mongoDB network:

Install the mongoDB network:
```bash
docker network create my_network
docker run -d --name mongodb -p 27017:27017 --network my_network --restart unless-stopped -v mongodb_data:/data/db mongo
```

Pull the images:
If you are not logged in, you can use the following command:
```bash
echo your-personal-access-token | docker login ghcr.io -u your-github-username --password-stdin
```
replace `your-personal-access-token` and `your-github-username` with your own values.

Then pull the images:
```bash
docker pull ghcr.io/hand-e-fr/hostasphere/rest:latest
docker pull ghcr.io/hand-e-fr/hostasphere/datasource:latest
docker pull ghcr.io/hand-e-fr/hostasphere/front:latest
```

Run the containers:
```bash
docker run -d --name rest -p 8080:8080 --network my_network --restart unless-stopped ghcr.io/hand-e-fr/hostasphere/rest:latest
docker run -d --name datasource -p 50051:50051 --network my_network --restart unless-stopped ghcr.io/hand-e-fr/hostasphere/datasource:latest
docker run -d --name front -p 3000:3000 --network my_network --restart unless-stopped ghcr.io/hand-e-fr/hostasphere/front:latest
```
You can now access the front at `http://localhost:3000` and the rest at `http://localhost:8080`.
The datasource is not accessible from the browser, it is used by client api to pull data.

If you need to change ports, you can do it by changing the `-p` parameter in the `docker run` command.
And if you need to change the network name, you can do it by changing the `--network` parameter in the `docker run` command.
The `--restart unless-stopped` parameter will restart the container if it stops.
