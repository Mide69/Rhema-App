@echo off

REM Login to Docker Hub
docker login

REM Build and tag backend image
docker build -t tektribe/rbtc-backend:latest ./backend
docker tag tektribe/rbtc-backend:latest tektribe/rbtc-backend:v1.0

REM Build and tag frontend image
docker build -t tektribe/rbtc-frontend:latest ./frontend
docker tag tektribe/rbtc-frontend:latest tektribe/rbtc-frontend:v1.0

REM Push images to Docker Hub
docker push tektribe/rbtc-backend:latest
docker push tektribe/rbtc-backend:v1.0
docker push tektribe/rbtc-frontend:latest
docker push tektribe/rbtc-frontend:v1.0

echo Images pushed to tektribe Docker Hub successfully!