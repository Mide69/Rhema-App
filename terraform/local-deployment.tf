# Local Docker Deployment (No AWS Required)
resource "docker_image" "rbtc_backend" {
  name = "rbtc-backend:latest"
  build {
    context = "../"
    dockerfile = "backend/Dockerfile"
  }
}

resource "docker_image" "rbtc_frontend" {
  name = "rbtc-frontend:latest"
  build {
    context = "../"
    dockerfile = "frontend/Dockerfile"
  }
}

resource "docker_container" "mongodb" {
  image = "mongo:6.0"
  name  = "rbtc-mongodb"
  ports {
    internal = 27017
    external = 27017
  }
  env = [
    "MONGO_INITDB_ROOT_USERNAME=admin",
    "MONGO_INITDB_ROOT_PASSWORD=password123"
  ]
}

resource "docker_container" "backend" {
  image = docker_image.rbtc_backend.image_id
  name  = "rbtc-backend"
  ports {
    internal = 8080
    external = 8080
  }
  env = [
    "MONGODB_URI=mongodb://admin:password123@mongodb:27017/rbtc?authSource=admin",
    "PORT=8080"
  ]
  depends_on = [docker_container.mongodb]
}

resource "docker_container" "frontend" {
  image = docker_image.rbtc_frontend.image_id
  name  = "rbtc-frontend"
  ports {
    internal = 3000
    external = 3000
  }
  depends_on = [docker_container.backend]
}