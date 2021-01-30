terraform {
  backend "s3" {
    bucket = "neatowebsolutions-upselling-infrastructure"
    key    = "logs-service.tfstate"
    region = "us-east-1"
  }
}

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

resource "aws_sqs_queue" "log" {
  name = "log-queue-${terraform.workspace}"
}

resource "aws_ssm_parameter" "log_queue_arn" {
  name  = "/upselling/${terraform.workspace}/queues/log/arn"
  type  = "String"
  value = aws_sqs_queue.log.arn
}

resource "aws_ssm_parameter" "log_queue_url" {
  name  = "/upselling/${terraform.workspace}/queues/log/url"
  type  = "String"
  value = aws_sqs_queue.log.id
}
