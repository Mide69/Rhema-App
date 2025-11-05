#!/bin/bash

# Install kubectl and setup Kubernetes on EC2
echo "Installing kubectl..."
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install kind (Kubernetes in Docker)
echo "Installing kind..."
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind

# Create Kubernetes cluster
echo "Creating Kubernetes cluster..."
kind create cluster --name rbtc-cluster

# Create ArgoCD namespace
echo "Creating ArgoCD namespace..."
kubectl create namespace argocd

# Install ArgoCD
echo "Installing ArgoCD..."
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for ArgoCD to be ready
echo "Waiting for ArgoCD..."
kubectl wait --for=condition=available --timeout=300s deployment/argocd-server -n argocd

# Get admin password
echo "Getting ArgoCD admin password..."
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
echo ""

echo "Setup complete!"
echo "Run: kubectl port-forward svc/argocd-server -n argocd 8080:443"