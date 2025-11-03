# Docker Desktop Not Running

## Fix Steps:

1. **Start Docker Desktop**
   - Search "Docker Desktop" in Windows Start Menu
   - Click to open Docker Desktop
   - Wait for Docker engine to start (whale icon in system tray)

2. **Verify Docker is Running**
```bash
docker --version
docker ps
```

3. **Then Build and Push Images**
```bash
docker build -t tektribe/rbtc-backend:latest ./backend
docker build -t tektribe/rbtc-frontend:latest ./frontend
docker push tektribe/rbtc-backend:latest
docker push tektribe/rbtc-frontend:latest
```

## Alternative: Use GitHub Actions
Push code to GitHub - the workflow will automatically build and push to tektribe Docker Hub.

**Error**: Docker Desktop is not running. Start it first, then retry the build commands.