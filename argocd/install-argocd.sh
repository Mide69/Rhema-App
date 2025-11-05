#!/bin/bash

# Install ArgoCD on Kubernetes cluster

echo "Installing ArgoCD..."
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

echo "Waiting for ArgoCD to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/argocd-server -n argocd

echo "Getting admin password..."
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
echo ""

echo "Port forwarding ArgoCD UI..."
kubectl port-forward svc/argocd-server -n argocd 8080:443 &

echo "ArgoCD UI: https://localhost:8080"
echo "Username: admin"