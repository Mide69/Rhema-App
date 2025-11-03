# Complete EC2 Deployment Instructions

## Step 1: Launch EC2 Instance
1. Launch Amazon Linux 2 EC2 instance (t3.medium recommended)
2. Configure Security Group:
   - SSH (22) - Your IP
   - HTTP (3000) - 0.0.0.0/0
   - Custom (8080) - 0.0.0.0/0
   - MongoDB (27017) - 0.0.0.0/0

## Step 2: Connect to EC2
```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
```

## Step 3: Run Complete Setup
```bash
# Download and run setup script
curl -O https://raw.githubusercontent.com/your-repo/rbtc-app/main/ec2-complete-setup.sh
chmod +x ec2-complete-setup.sh
./ec2-complete-setup.sh
```

## Step 4: Access Application
- Frontend: http://your-ec2-ip:3000
- Backend API: http://your-ec2-ip:8080
- MongoDB: your-ec2-ip:27017

## Manual Setup (Alternative)
If you prefer manual setup, copy the script content and run each section step by step.

## Troubleshooting
```bash
# Check containers
docker-compose ps

# View logs
docker-compose logs

# Restart services
docker-compose restart

# Stop all
docker-compose down
```

## What Gets Installed
- Docker & Docker Compose
- MongoDB database
- Node.js backend API
- Frontend web application
- Complete RBTC Nigeria app stack