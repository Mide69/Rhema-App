output "cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = aws_eks_cluster.rbtc_cluster.endpoint
}

output "cluster_name" {
  description = "EKS cluster name"
  value       = aws_eks_cluster.rbtc_cluster.name
}

output "database_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.rbtc_db.endpoint
}