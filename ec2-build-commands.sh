#!/bin/bash

# EC2 Docker Build Commands

echo "Building Docker images on EC2..."

# Build backend image
docker build -t tektribe/rbtc-backend:latest ./backend

# Build frontend image  
docker build -t tektribe/rbtc-frontend:latest ./frontend

# Login to Docker Hub
docker login

# Push images to tektribe Docker Hub
docker push tektribe/rbtc-backend:latest
docker push tektribe/rbtc-frontend:latest

echo "Images built and pushed successfully!"
echo "Backend: tektribe/rbtc-backend:latest"
echo "Frontend: tektribe/rbtc-frontend:latest"