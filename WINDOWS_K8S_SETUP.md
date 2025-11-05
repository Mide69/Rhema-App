# Windows Kubernetes Setup

## Option 1: Use Docker Desktop
1. Install Docker Desktop with Kubernetes enabled
2. Enable Kubernetes in Docker Desktop settings
3. Run: `kubectl create namespace argocd`

## Option 2: Manual Install
```powershell
# Download kubectl
Invoke-WebRequest -Uri "https://dl.k8s.io/release/v1.28.0/bin/windows/amd64/kubectl.exe" -OutFile "kubectl.exe"

# Download kind
Invoke-WebRequest -Uri "https://kind.sigs.k8s.io/dl/v0.20.0/kind-windows-amd64" -OutFile "kind.exe"

# Create cluster
.\kind.exe create cluster --name rbtc-cluster

# Create namespace
.\kubectl.exe create namespace argocd
```

## Option 3: Use EC2 Server (Recommended)
Run these commands on your EC2 server instead:
```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install kubectl /usr/local/bin/kubectl
kind create cluster --name rbtc-cluster
kubectl create namespace argocd
```