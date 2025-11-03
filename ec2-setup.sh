#!/bin/bash

# EC2 Setup Script for RBTC Nigeria App

echo "Installing Docker..."
sudo yum update -y
sudo yum install -y docker git
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo "Cloning repository..."
git clone https://github.com/your-repo/rbtc-nigeria-app.git
cd rbtc-nigeria-app

echo "Building and pushing Docker images..."
docker login
docker build -t tektribe/rbtc-backend:latest ./backend
docker build -t tektribe/rbtc-frontend:latest ./frontend
docker push tektribe/rbtc-backend:latest
docker push tektribe/rbtc-frontend:latest

echo "Starting application..."
docker-compose up -d

echo "Setup complete!"
echo "Frontend: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3000"
echo "Backend: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8080"