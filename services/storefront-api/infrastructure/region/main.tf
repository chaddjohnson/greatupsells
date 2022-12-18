terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      configuration_aliases = [aws.region]
    }
  }
}

data "aws_region" "current" {
  provider = aws.region
}

data "terraform_remote_state" "greatupsells_infrastructure" {
  backend = "s3"
  config = {
    bucket = "greatupsells-infrastructure"
    key    = "env:/${terraform.workspace}/infrastructure.tfstate"
    region = "us-east-1"
  }
}

resource "aws_ssm_parameter" "storefront_api_domain" {
  name      = "/greatupsells/${terraform.workspace}/storefront-api/domain"
  type      = "String"
  value     = var.storefront_api_domain
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "storefront_api_url" {
  name      = "/greatupsells/${terraform.workspace}/storefront-api/url"
  type      = "String"
  value     = "https://${var.storefront_api_domain}"
  overwrite = true
  provider  = aws.region
}

resource "aws_route53_health_check" "storefront_api" {
  fqdn              = aws_ssm_parameter.storefront_api_domain.value
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = "5"
  request_interval  = "30"
  regions           = ["us-east-1", "eu-west-1", "ap-northeast-1"]

  tags = {
    Name = "storefront-api-${terraform.workspace}"
  }
}

resource "aws_ssm_parameter" "storefront_api_health_check_id" {
  name      = "/greatupsells/${terraform.workspace}/storefront-api/health-check-id"
  type      = "String"
  value     = aws_route53_health_check.storefront_api.id
  overwrite = true
  provider  = aws.region
}
