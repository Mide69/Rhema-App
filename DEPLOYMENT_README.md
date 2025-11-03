# RBTC Nigeria - Deployment Guide

## Terraform Deployment (AWS EKS)

### Prerequisites
- AWS CLI configured
- Terraform installed
- kubectl installed

### Deploy Infrastructure
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

terraform init
terraform plan
terraform apply
```

### Configure kubectl
```bash
aws eks update-kubeconfig --region us-west-2 --name rbtc-cluster
```

## ArgoCD Deployment

### Install ArgoCD
```bash
kubectl apply -f argocd/install.yaml
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### Access ArgoCD UI
```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
# Get admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

### Deploy Application
```bash
kubectl apply -f argocd/application.yaml
```

## Manual Kubernetes Deployment
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

## Access Application
```bash
kubectl get services -n rbtc-production
# Use LoadBalancer external IP to access frontend
```