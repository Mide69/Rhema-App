terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Security Group
resource "aws_security_group" "rbtc_sg" {
  name_prefix = "rbtc-sg"
  
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2 Instance
resource "aws_instance" "rbtc_server" {
  ami           = "ami-0c02fb55956c7d316" # Amazon Linux 2
  instance_type = "t3.medium"
  
  vpc_security_group_ids = [aws_security_group.rbtc_sg.id]
  
  user_data = file("${path.module}/user-data.sh")
  
  tags = {
    Name = "RBTC-Nigeria-Server"
  }
}

output "ec2_public_ip" {
  value = aws_instance.rbtc_server.public_ip
}

output "frontend_url" {
  value = "http://${aws_instance.rbtc_server.public_ip}:3000"
}

output "backend_url" {
  value = "http://${aws_instance.rbtc_server.public_ip}:8080"
}