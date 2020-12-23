provider "aws" {
  region                      = var.region
  s3_force_path_style         = terraform.workspace == "dev"
  skip_credentials_validation = terraform.workspace == "dev"
  skip_metadata_api_check     = terraform.workspace == "dev"
  skip_requesting_account_id  = terraform.workspace == "dev"
  version                     = "~> 3.18"

  endpoints {
    sqs = terraform.workspace == "dev" ? "http://localhost:4566" : null
    ssm = terraform.workspace == "dev" ? "http://localhost:4566" : null
  }
}

resource "aws_sqs_queue" "log-queue" {
  name = "log-queue-${terraform.workspace}"
}

resource "aws_ssm_parameter" "log-queue-arn" {
  name  = "/${terraform.workspace}/log-queue-arn"
  type  = "String"
  value = aws_sqs_queue.log-queue.arn
}

resource "aws_ssm_parameter" "log-queue-url" {
  name  = "/upselling/${terraform.workspace}/log-queue-url"
  type  = "String"
  value = aws_sqs_queue.log-queue.id
}
