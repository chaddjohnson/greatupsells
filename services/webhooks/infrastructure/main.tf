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

data "terraform_remote_state" "greatupsells_infrastructure" {
  backend = "s3"
  config = {
    bucket = "greatupsells-infrastructure"
    key    = "env:/${terraform.workspace}/infrastructure.tfstate"
    region = "us-east-1"
  }
}

locals {
  domain = "webhooks-service.${data.aws_region.current.name}.${data.terraform_remote_state.greatupsells_infrastructure.outputs.domain}"
}

resource "aws_ssm_parameter" "webhooks_service_regional_domain" {
  name      = "/greatupsells/${terraform.workspace}/webhooks-service/regional-domain"
  type      = "String"
  value     = local.domain
  overwrite = true
  provider  = aws.region
}

resource "aws_route53_health_check" "webhooks_service" {
  fqdn              = local.domain
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = "5"
  request_interval  = "30"
  regions           = ["us-east-1", "eu-west-1", "ap-northeast-1"]

  tags = {
    Name = "webhooks-service-${terraform.workspace}"
  }
}

resource "aws_ssm_parameter" "webhooks_service_health_check_id" {
  name      = "/greatupsells/${terraform.workspace}/webhooks-service/health-check-id"
  type      = "String"
  value     = aws_route53_health_check.webhooks_service.id
  overwrite = true
  provider  = aws.region
}
