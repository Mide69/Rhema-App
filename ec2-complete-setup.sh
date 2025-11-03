#!/bin/bash

# Complete EC2 Setup for RBTC Nigeria App

echo "=== Installing Docker and Dependencies ==="
sudo yum update -y
sudo yum install -y docker git
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

echo "=== Installing Docker Compose ==="
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo "=== Restarting session for docker group ==="
newgrp docker

echo "=== Creating application directory ==="
mkdir -p /home/ec2-user/rbtc-app
cd /home/ec2-user/rbtc-app

echo "=== Creating backend files ==="
mkdir -p backend
cat > backend/server.js << 'EOF'
const http = require('http');
const url = require('url');

const PORT = 8080;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (parsedUrl.pathname === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({
      message: 'RBTC Nigeria Student App API',
      status: 'Running',
      endpoints: ['/api/test', '/health']
    }));
  } else if (parsedUrl.pathname === '/api/test') {
    res.writeHead(200);
    res.end(JSON.stringify({
      message: 'API is working!',
      timestamp: new Date().toISOString()
    }));
  } else if (parsedUrl.pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'OK' }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
EOF

cat > backend/package.json << 'EOF'
{
  "name": "rbtc-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  }
}
EOF

cat > backend/Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]
EOF

echo "=== Creating frontend files ==="
mkdir -p frontend
cat > frontend/server.js << 'EOF'
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading page');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend running at http://0.0.0.0:${PORT}`);
});
EOF

cat > frontend/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>RBTC Nigeria Student App</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .header { background: #1E88E5; color: white; padding: 20px; text-align: center; margin-bottom: 20px; }
        .card { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .btn { background: #1E88E5; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        .status { padding: 10px; border-radius: 4px; margin: 10px 0; }
        .success { background: #E8F5E8; color: #2E7D32; }
        .error { background: #FFEBEE; color: #C62828; }
    </style>
</head>
<body>
    <div class="header">
        <h1>RBTC Nigeria Student App</h1>
        <p>Rhema Bible Training College - Student Portal</p>
    </div>
    <div class="card">
        <h2>Welcome to RBTC Nigeria</h2>
        <p>Your comprehensive student management system.</p>
        <div id="status" class="status"></div>
        <button class="btn" onclick="testAPI()">Test API Connection</button>
    </div>
    <script>
        async function testAPI() {
            const statusDiv = document.getElementById('status');
            statusDiv.textContent = 'Testing API connection...';
            try {
                const response = await fetch('/api/test');
                const data = await response.json();
                statusDiv.textContent = `✅ API Connected: ${data.message}`;
                statusDiv.className = 'status success';
            } catch (error) {
                statusDiv.textContent = `❌ API Connection Failed: ${error.message}`;
                statusDiv.className = 'status error';
            }
        }
        window.onload = () => testAPI();
    </script>
</body>
</html>
EOF

cat > frontend/Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
EOF

echo "=== Creating Docker Compose file ==="
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  mongodb:
    image: mongo:6.0
    container_name: rbtc-mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    container_name: rbtc-backend
    ports:
      - "8080:8080"
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    container_name: rbtc-frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mongodb_data:
EOF

echo "=== Building and starting application ==="
docker-compose up -d --build

echo "=== Setup complete! ==="
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "Frontend: http://$PUBLIC_IP:3000"
echo "Backend: http://$PUBLIC_IP:8080"
echo "MongoDB: $PUBLIC_IP:27017"

echo "=== Checking container status ==="
docker-compose ps