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

resource "aws_ssm_parameter" "storefront_api_regional_domain" {
  name      = "/upselling/${terraform.workspace}/storefront-api/regional-domain"
  type      = "String"
  value     = "storefront-api.${data.aws_region.current.name}.${data.terraform_remote_state.upselling_infrastructure.outputs.domain}"
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "storefront_api_url" {
  name     = "/upselling/${terraform.workspace}/storefront-api/url"
  type     = "String"
  value    = "https://${var.storefront_api_domain}"
  provider = aws.region
}

resource "aws_route53_health_check" "storefront_api" {
  fqdn              = aws_ssm_parameter.storefront_api_regional_domain.value
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = "5"
  request_interval  = "30"
}

resource "aws_route53_record" "storefront_api" {
  zone_id         = data.terraform_remote_state.upselling_infrastructure.outputs.hosted_zone_id
  name            = var.storefront_api_domain
  type            = "CNAME"
  ttl             = "86400"
  set_identifier  = data.aws_region.current.name
  records         = [aws_ssm_parameter.storefront_api_regional_domain.value]
  health_check_id = aws_route53_health_check.storefront_api.id

  latency_routing_policy {
    region = data.aws_region.current.name
  }
}
