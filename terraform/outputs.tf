output "frontend_url" {
  description = "Frontend application URL"
  value       = "http://localhost:3000"
}

output "backend_url" {
  description = "Backend API URL"
  value       = "http://localhost:8080"
}

output "database_url" {
  description = "MongoDB connection URL"
  value       = "mongodb://admin:password123@localhost:27017"
}