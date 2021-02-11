terraform {
  backend "s3" {
    bucket = "neatowebsolutions-upselling-infrastructure"
    key    = "logs-service.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  version = "~> 3.18"
  region  = "us-east-1"
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
