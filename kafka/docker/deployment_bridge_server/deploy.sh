version=2.8

docker buildx build --platform linux/amd64 --network=host -t registry.deti/egs-fuellink/deployment-bridge_server:$version .

docker push registry.deti/egs-fuellink/deployment-bridge_server:$version
