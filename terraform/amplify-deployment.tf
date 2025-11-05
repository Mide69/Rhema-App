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

# Amplify App
resource "aws_amplify_app" "rbtc_app" {
  name       = "rbtc-nigeria-app"
  repository = "https://github.com/tektribe/rbtc-nigeria-app"
  
  build_spec = file("${path.module}/../amplify.yml")
  
  environment_variables = {
    AMPLIFY_MONOREPO_APP_ROOT = "frontend"
  }
}

# Amplify Branch
resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.rbtc_app.id
  branch_name = "main"
  
  enable_auto_build = true
}

# Lambda Function for Backend
resource "aws_lambda_function" "rbtc_backend" {
  filename         = "backend.zip"
  function_name    = "rbtc-backend"
  role            = aws_iam_role.lambda_role.arn
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  
  depends_on = [data.archive_file.backend_zip]
}

# API Gateway
resource "aws_api_gateway_rest_api" "rbtc_api" {
  name = "rbtc-api"
}

resource "aws_api_gateway_resource" "api" {
  rest_api_id = aws_api_gateway_rest_api.rbtc_api.id
  parent_id   = aws_api_gateway_rest_api.rbtc_api.root_resource_id
  path_part   = "api"
}

resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = aws_api_gateway_rest_api.rbtc_api.id
  resource_id   = aws_api_gateway_resource.api.id
  http_method   = "ANY"
  authorization = "NONE"
}

# Lambda ZIP
data "archive_file" "backend_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../backend"
  output_path = "backend.zip"
}

# IAM Role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "rbtc-lambda-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Outputs
output "amplify_url" {
  value = "https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.rbtc_app.default_domain}"
}

output "api_gateway_url" {
  value = aws_api_gateway_rest_api.rbtc_api.execution_arn
}