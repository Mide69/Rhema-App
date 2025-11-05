# Windows PowerShell setup for Kubernetes and ArgoCD

# Install kubectl
Invoke-WebRequest -Uri "https://dl.k8s.io/release/v1.28.0/bin/windows/amd64/kubectl.exe" -OutFile "kubectl.exe"
Move-Item kubectl.exe C:\Windows\System32\

# Install kind
Invoke-WebRequest -Uri "https://kind.sigs.k8s.io/dl/v0.20.0/kind-windows-amd64" -OutFile "kind.exe"
Move-Item kind.exe C:\Windows\System32\

# Create Kubernetes cluster
kind create cluster --name rbtc-cluster

# Create ArgoCD namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

Write-Host "Setup complete! Run: kubectl port-forward svc/argocd-server -n argocd 8080:443"