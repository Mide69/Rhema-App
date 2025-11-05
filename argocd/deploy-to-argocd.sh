#!/bin/bash

# Deploy RBTC Nigeria App to ArgoCD

echo "1. Installing ArgoCD..."
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

echo "2. Waiting for ArgoCD to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/argocd-server -n argocd

echo "3. Creating RBTC application..."
kubectl apply -f application.yaml

echo "4. Getting ArgoCD admin password..."
ARGOCD_PASSWORD=$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)

echo "5. Port forwarding ArgoCD UI..."
kubectl port-forward svc/argocd-server -n argocd 8080:443 &

echo "=== ArgoCD Deployment Complete ==="
echo "ArgoCD UI: https://localhost:8080"
echo "Username: admin"
echo "Password: $ARGOCD_PASSWORD"
echo ""
echo "Application: rbtc-nigeria-app"
echo "Namespace: rbtc-production"