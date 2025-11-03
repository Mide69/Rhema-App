variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "rbtc_admin"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}