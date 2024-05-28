# Deployment

## Create the deployment-bridge_server container

Build the container with the `registry.deti` in mind:nginx

```bash
docker buildx build --platform linux/amd64 --network=host -t registry.deti/egs-fuellink/deployment-bridge_server:2.0 .
```

Then, upload the container to `registry.deti`:

```bash
docker push registry.deti/egs-fuellink/deployment-bridge_server:2.0
```

# Example payload in kafka producer

```json
{"timestamp": "2024-04-10T22:47:15.648650832Z", "imageId": 85635071, "results": [{"box": {"xmin": 115, "ymin": 40, "xmax": 1254, "ymax": 265}, "plate": "18UX45", "region": {"code": "pt", "score": 0.041}, "score": 0.9, "candidates": [{"score": 0.9, "plate": "18UX45"}], "dscore": 0.871, "vehicle": {"score": 0.0, "type": "Unknown", "box": {"xmin": 0, "ymin": 0, "xmax": 0, "ymax": 0}}}], "thingId": "org.eclipse.ditto:c5ae6b75-3da1-4cd3-b0c5-ff22fa509233"}
```