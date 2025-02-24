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

locals {
  domain = "logs-api.${data.aws_region.current.name}.${data.terraform_remote_state.greatupsells_infrastructure.outputs.domain}"
}

data "aws_sns_topic" "health_check_alarm_topic" {
  name     = "health-check-alarm-topic-${terraform.workspace}"
  provider = aws.region
}

resource "aws_ssm_parameter" "logs_api_regional_domain" {
  name      = "/greatupsells/${terraform.workspace}/logs-api/regional-domain"
  type      = "String"
  value     = local.domain
  overwrite = true
  provider  = aws.region
}

resource "aws_route53_health_check" "logs_api" {
  fqdn              = local.domain
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = "5"
  request_interval  = "30"
  regions           = ["us-east-1"] # ["us-east-1", "eu-west-1", "ap-northeast-1"]

  tags = {
    Name = "logs-api-${terraform.workspace}"
  }
}

resource "aws_cloudwatch_metric_alarm" "logs_api" {
  alarm_name          = "logs-api-alarm-${terraform.workspace}"
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
    HealthCheckId = aws_route53_health_check.logs_api.id
  }
}

resource "aws_sns_topic_subscription" "health_check_alarm_topic_subscription" {
  topic_arn = data.aws_sns_topic.health_check_alarm_topic.arn
  protocol  = "email"
  endpoint  = data.terraform_remote_state.greatupsells_infrastructure.outputs.health_check_alarm_topic_email
}

resource "aws_ssm_parameter" "logs_api_health_check_id" {
  name      = "/greatupsells/${terraform.workspace}/logs-api/health-check-id"
  type      = "String"
  value     = aws_route53_health_check.logs_api.id
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "logs_api_url" {
  name      = "/greatupsells/${terraform.workspace}/logs-api/url"
  type      = "String"
  value     = "https://${local.domain}"
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "logs_notification_email" {
  name      = "/greatupsells/${terraform.workspace}/logs-notification-email"
  type      = "String"
  value     = var.logs_notification_email
  overwrite = true
  provider  = aws.region
}
