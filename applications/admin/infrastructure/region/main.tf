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

resource "aws_ssm_parameter" "admin_app_regional_domain" {
  name     = "/upselling/${terraform.workspace}/admin-app/regional-domain"
  type     = "String"
  value    = "admin.${data.aws_region.current.name}.${data.terraform_remote_state.upselling_infrastructure.outputs.domain}"
  provider = aws.region
}

resource "aws_ssm_parameter" "admin_app_url" {
  name     = "/upselling/${terraform.workspace}/admin-app/url"
  type     = "String"
  value    = "https://${var.admin_app_domain}"
  provider = aws.region
}

resource "aws_route53_health_check" "admin_app" {
  fqdn              = aws_ssm_parameter.admin_app_regional_domain.value
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = "5"
  request_interval  = "30"
}

resource "aws_route53_record" "admin_app" {
  zone_id         = data.terraform_remote_state.upselling_infrastructure.outputs.hosted_zone_id
  name            = var.admin_app_domain
  type            = "A"
  set_identifier  = data.aws_region.current.name
  health_check_id = aws_route53_health_check.admin_app.id

  alias {
    name                   = aws_ssm_parameter.admin_app_regional_domain.value
    zone_id                = data.terraform_remote_state.upselling_infrastructure.outputs.hosted_zone_id
    evaluate_target_health = true
  }

  latency_routing_policy {
    region = data.aws_region.current.name
  }
}
