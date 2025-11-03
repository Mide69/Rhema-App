# Quick Local Deployment (No AWS Required)

## Prerequisites
- Docker Desktop installed and running
- Terraform installed

## Deploy Locally with Terraform + Docker

```bash
cd terraform
terraform init
terraform apply -auto-approve
```

## Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api/test
- MongoDB: localhost:27017

## Clean Up
```bash
terraform destroy -auto-approve
```

## Alternative: Docker Compose
```bash
docker-compose up -d
```

This deploys the full RBTC Nigeria app locally without needing AWS credentials.