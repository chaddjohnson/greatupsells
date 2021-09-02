terraform {
  backend "s3" {
    bucket = "neatowebsolutions-upselling-infrastructure"
    key    = "logs-service.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_sqs_queue" "log" {
  name = "log-queue-${terraform.workspace}"
}

resource "aws_sqs_queue_policy" "log_policy" {
  queue_url = "${aws_sqs_queue.log.id}"
  policy    = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "sqs:SendMessage",
      "Resource": "${aws_sqs_queue.log.arn}"
    }
  ]
}
EOF
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
