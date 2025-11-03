# EC2 Server Deployment

## Install Docker on EC2
```bash
sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user
```

## Build and Push Images
```bash
# Login to Docker Hub
docker login

# Build images
docker build -t tektribe/rbtc-backend:latest ./backend
docker build -t tektribe/rbtc-frontend:latest ./frontend

# Push to Docker Hub
docker push tektribe/rbtc-backend:latest
docker push tektribe/rbtc-frontend:latest
```

## Deploy Application
```bash
docker-compose up -d
```

## Access Application
- Frontend: http://your-ec2-ip:3000
- Backend: http://your-ec2-ip:8080