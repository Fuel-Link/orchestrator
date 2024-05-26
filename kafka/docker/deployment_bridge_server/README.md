# Deployment

## Create the deployment-bridge_server container

Build the container with the `registry.deti` in mind:

```bash
docker buildx build --platform linux/amd64 --network=host -t registry.deti/egs-fuellink/deployment-bridge_server:1.0 .
```

Then, upload the container to `registry.deti`:

```bash
docker push registry.deti/egs-fuellink/deployment-bridge_server:1.0
```