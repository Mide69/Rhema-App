# AWS Amplify Deployment Guide

## Architecture
- **Frontend**: AWS Amplify (Static Hosting)
- **Backend**: AWS Lambda + API Gateway
- **Database**: DynamoDB (serverless)

## Deploy Steps

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tektribe/rbtc-nigeria-app.git
git push -u origin main
```

### 2. Deploy with Terraform
```bash
cd terraform
terraform init
terraform apply -var="aws_region=us-east-1"
```

### 3. Manual Amplify Setup
1. Go to AWS Amplify Console
2. Connect GitHub repository
3. Select `frontend` as root directory
4. Deploy automatically

## Access Points
- **Frontend**: https://main.amplifyapp.com
- **API**: https://api-gateway-url/api/test

## Environment Variables
Set in Amplify Console:
- `REACT_APP_API_URL`: API Gateway URL

## Build Configuration
Uses `amplify.yml` for build settings.