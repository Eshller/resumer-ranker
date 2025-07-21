#!/bin/bash

# Build and run the Docker container
echo "Building Docker image..."
docker build -t resumer-ranker .

echo "Running container..."
docker run -d \
  --name resumer-ranker \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_TELEMETRY_DISABLED=1 \
  resumer-ranker

echo "Application is running on http://localhost:3000"
echo "To stop the container: docker stop resumer-ranker"
echo "To remove the container: docker rm resumer-ranker" 