terraform {
  backend "s3" {
    bucket = "greatupsells-infrastructure2"
    key    = "webhooks-service.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

data "aws_region" "current" {}

data "terraform_remote_state" "greatupsells_infrastructure" {
  backend = "s3"
  config = {
    bucket = "greatupsells-infrastructure2"
    key    = "env:/${terraform.workspace}/infrastructure.tfstate"
    region = "us-east-1"
  }
}

locals {
  domain = "webhooks-service.${data.aws_region.current.name}.${data.terraform_remote_state.greatupsells_infrastructure.outputs.domain}"
}

data "aws_sns_topic" "health_check_alarm_topic" {
  name     = "health-check-alarm-topic-${terraform.workspace}"
}

resource "aws_ssm_parameter" "webhooks_service_regional_domain" {
  name      = "/greatupsells/${terraform.workspace}/webhooks-service/regional-domain"
  type      = "String"
  value     = local.domain
  overwrite = true
}

resource "aws_route53_health_check" "webhooks_service" {
  fqdn              = local.domain
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = "5"
  request_interval  = "30"

  tags = {
    Name = "webhooks-service-${terraform.workspace}"
  }
}

resource "aws_cloudwatch_metric_alarm" "webhooks_service" {
  alarm_name          = "webhooks-service-alarm-${terraform.workspace}"
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
    HealthCheckId = aws_route53_health_check.webhooks_service.id
  }
}

resource "aws_sns_topic_subscription" "health_check_alarm_topic_subscription" {
  topic_arn = data.aws_sns_topic.health_check_alarm_topic.arn
  protocol  = "email"
  endpoint  = data.terraform_remote_state.greatupsells_infrastructure.outputs.health_check_alarm_topic_email
}

resource "aws_ssm_parameter" "webhooks_service_health_check_id" {
  name      = "/greatupsells/${terraform.workspace}/webhooks-service/health-check-id"
  type      = "String"
  value     = aws_route53_health_check.webhooks_service.id
  overwrite = true
}
