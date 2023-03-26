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

resource "aws_ssm_parameter" "shopify_admin_app_domain" {
  name      = "/greatupsells/${terraform.workspace}/shopify-admin-app/domain"
  type      = "String"
  value     = var.shopify_admin_app_domain
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "shopify_admin_app_latency_domain" {
  name      = "/greatupsells/${terraform.workspace}/shopify-admin-app/latency-domain"
  type      = "String"
  value     = "shopify-admin.latency.${data.terraform_remote_state.greatupsells_infrastructure.outputs.domain}"
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "shopify_admin_app_url" {
  name      = "/greatupsells/${terraform.workspace}/shopify-admin-app/url"
  type      = "String"
  value     = "https://${var.shopify_admin_app_domain}"
  overwrite = true
  provider  = aws.region
}

resource "aws_route53_health_check" "shopify_admin_app" {
  fqdn              = aws_ssm_parameter.shopify_admin_app_domain.value
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = "5"
  request_interval  = "30"
  regions           = ["us-east-1", "eu-west-1", "ap-northeast-1"]

  tags = {
    Name = "shopify-admin-app-${terraform.workspace}"
  }
}

resource "aws_cloudwatch_metric_alarm" "shops_api" {
  alarm_name          = "shopify-admin-app-alarm-${terraform.workspace}"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "3"
  metric_name         = "HealthCheckPercentageHealthy"
  namespace           = "AWS/Route53"
  period              = "60"
  statistic           = "Minimum"
  threshold           = "18"
  alarm_actions       = [data.aws_sns_topic.health_check_alarm_topic.arn]
  ok_actions          = [data.aws_sns_topic.health_check_alarm_topic.arn]

  dimensions = {
    HealthCheckId = aws_route53_health_check.shops_api.id
  }
}

resource "aws_sns_topic_subscription" "health_check_alarm_topic_subscription" {
  topic_arn = data.aws_sns_topic.health_check_alarm_topic.arn
  protocol  = "email"
  endpoint  = data.terraform_remote_state.greatupsells_infrastructure.outputs.health_check_alarm_topic_email
}

resource "aws_ssm_parameter" "shopify_admin_app_health_check_id" {
  name      = "/greatupsells/${terraform.workspace}/shopify-admin-app/health-check-id"
  type      = "String"
  value     = aws_route53_health_check.shopify_admin_app.id
  overwrite = true
  provider  = aws.region
}
