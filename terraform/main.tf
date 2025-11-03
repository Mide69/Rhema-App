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

# VPC
resource "aws_vpc" "rbtc_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "rbtc-vpc"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "rbtc_igw" {
  vpc_id = aws_vpc.rbtc_vpc.id
  
  tags = {
    Name = "rbtc-igw"
  }
}

# Public Subnets
resource "aws_subnet" "public_subnet" {
  count             = 2
  vpc_id            = aws_vpc.rbtc_vpc.id
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]
  
  map_public_ip_on_launch = true
  
  tags = {
    Name = "rbtc-public-subnet-${count.index + 1}"
  }
}

# Route Table
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.rbtc_vpc.id
  
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.rbtc_igw.id
  }
  
  tags = {
    Name = "rbtc-public-rt"
  }
}

resource "aws_route_table_association" "public_rta" {
  count          = 2
  subnet_id      = aws_subnet.public_subnet[count.index].id
  route_table_id = aws_route_table.public_rt.id
}

# Security Group
resource "aws_security_group" "rbtc_sg" {
  name_prefix = "rbtc-sg"
  vpc_id      = aws_vpc.rbtc_vpc.id
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 22
    to_port     = 22
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

# EKS Cluster
resource "aws_eks_cluster" "rbtc_cluster" {
  name     = "rbtc-cluster"
  role_arn = aws_iam_role.eks_cluster_role.arn
  
  vpc_config {
    subnet_ids = aws_subnet.public_subnet[*].id
  }
  
  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy,
  ]
}

# EKS Node Group
resource "aws_eks_node_group" "rbtc_nodes" {
  cluster_name    = aws_eks_cluster.rbtc_cluster.name
  node_group_name = "rbtc-nodes"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  subnet_ids      = aws_subnet.public_subnet[*].id
  
  scaling_config {
    desired_size = 2
    max_size     = 4
    min_size     = 1
  }
  
  instance_types = ["t3.medium"]
  
  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.eks_container_registry_policy,
  ]
}

# RDS Instance
resource "aws_db_instance" "rbtc_db" {
  identifier     = "rbtc-mongodb"
  engine         = "postgres"
  engine_version = "13.7"
  instance_class = "db.t3.micro"
  
  allocated_storage = 20
  storage_type      = "gp2"
  
  db_name  = "rbtc"
  username = var.db_username
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rbtc_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.rbtc_db_subnet_group.name
  
  skip_final_snapshot = true
}

resource "aws_db_subnet_group" "rbtc_db_subnet_group" {
  name       = "rbtc-db-subnet-group"
  subnet_ids = aws_subnet.public_subnet[*].id
}

data "aws_availability_zones" "available" {
  state = "available"
}