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

resource "aws_ssm_parameter" "admin_app_domain" {
  name      = "/greatupsells/${terraform.workspace}/admin-app/domain"
  type      = "String"
  value     = var.admin_app_domain
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "admin_app_latency_domain" {
  name      = "/greatupsells/${terraform.workspace}/admin-app/latency-domain"
  type      = "String"
  value     = "admin.latency.${data.terraform_remote_state.greatupsells_infrastructure.outputs.domain}"
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "admin_app_url" {
  name      = "/greatupsells/${terraform.workspace}/admin-app/url"
  type      = "String"
  value     = "https://${var.admin_app_domain}"
  overwrite = true
  provider  = aws.region
}

resource "aws_route53_health_check" "admin_app" {
  fqdn              = aws_ssm_parameter.admin_app_domain.value
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = "5"
  request_interval  = "60"
  regions           = ["us-east-1", "eu-west-1", "ap-northeast-1"]

  tags = {
    Name = "admin-app-${terraform.workspace}"
  }
}

resource "aws_ssm_parameter" "admin_app_health_check_id" {
  name      = "/greatupsells/${terraform.workspace}/admin-app/health-check-id"
  type      = "String"
  value     = aws_route53_health_check.admin_app.id
  overwrite = true
  provider  = aws.region
}
