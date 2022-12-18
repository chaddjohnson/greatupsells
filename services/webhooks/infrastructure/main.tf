terraform {
  backend "s3" {
    bucket = "greatupsells-infrastructure"
    key    = "webhooks-service.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_route53_health_check" "webhooks_service" {
  fqdn              = aws_ssm_parameter.webhooks_service_domain.value
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = "5"
  request_interval  = "60"
  regions           = ["us-east-1", "eu-west-1", "ap-northeast-1"]

  tags = {
    Name = "webhooks-service-${terraform.workspace}"
  }
}
