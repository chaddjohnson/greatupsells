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

data "terraform_remote_state" "upselling_infrastructure" {
  backend = "s3"
  config = {
    bucket = "neatowebsolutions-upselling-infrastructure"
    key    = "env:/${terraform.workspace}/infrastructure.tfstate"
    region = "us-east-1"
  }
}

resource "aws_ssm_parameter" "admin_api_domain" {
  name      = "/upselling/${terraform.workspace}/admin-api/domain"
  type      = "String"
  value     = var.admin_api_domain
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "admin_api_url" {
  name      = "/upselling/${terraform.workspace}/admin-api/url"
  type      = "String"
  value     = "https://${var.admin_api_domain}"
  overwrite = true
  provider  = aws.region
}

resource "aws_route53_health_check" "admin_api" {
  fqdn              = aws_ssm_parameter.admin_api_domain.value
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = "5"
  request_interval  = "30"
}

resource "aws_ssm_parameter" "admin_api_health_check_id" {
  name      = "/upselling/${terraform.workspace}/admin-api/health-check-id"
  type      = "String"
  value     = aws_route53_health_check.admin_api.id
  overwrite = true
  provider  = aws.region
}
