# Docker Build Issue - File Permission Error

## Problem
Windows file permissions causing Docker build to fail with "unknown file mode" error.

## Solutions

### Option 1: Use GitHub Actions (Recommended)
Push code to GitHub - the workflow will automatically build and push to tektribe Docker Hub.

### Option 2: Manual Fix
1. Copy files to a new directory with proper permissions
2. Build from the new directory

### Option 3: Use WSL2
```bash
wsl
cd /mnt/c/Users/olami/OneDrive/Desktop/DevOps/Rhema-App
docker build -t tektribe/rbtc-backend:latest ./backend
```

### Option 4: Pre-built Images
The docker-compose.yml is already configured to use:
- `tektribe/rbtc-backend:latest`
- `tektribe/rbtc-frontend:latest`

Someone else can build and push these images, then you can pull and use them.

## Current Status
- Docker images configured for tektribe Docker Hub
- GitHub Actions workflow ready
- File permission issue preventing local build