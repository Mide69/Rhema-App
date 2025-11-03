# Push RBTC Images to tektribe Docker Hub

## Prerequisites
1. Start Docker Desktop
2. Login to Docker Hub: `docker login`

## Build and Push Commands

### Backend Image
```bash
docker build -t tektribe/rbtc-backend:latest ./backend
docker tag tektribe/rbtc-backend:latest tektribe/rbtc-backend:v1.0
docker push tektribe/rbtc-backend:latest
docker push tektribe/rbtc-backend:v1.0
```

### Frontend Image
```bash
docker build -t tektribe/rbtc-frontend:latest ./frontend
docker tag tektribe/rbtc-frontend:latest tektribe/rbtc-frontend:v1.0
docker push tektribe/rbtc-frontend:latest
docker push tektribe/rbtc-frontend:v1.0
```

## Deploy from Docker Hub
```bash
docker-compose up -d
```

Images will be available at:
- `tektribe/rbtc-backend:latest`
- `tektribe/rbtc-frontend:latest`