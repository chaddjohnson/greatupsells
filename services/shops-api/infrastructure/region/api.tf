locals {
  mongodb_hosts = "${join(":27017,", data.terraform_remote_state.greatupsells_infrastructure.outputs.services_domains)}:27017"
  domain        = "shops-api.${data.aws_region.current.name}.${data.terraform_remote_state.greatupsells_infrastructure.outputs.domain}"
}

data "aws_sns_topic" "health_check_alarm_topic" {
  name     = "health-check-alarm-topic-${terraform.workspace}"
  provider = aws.region
}

resource "aws_route53_health_check" "shops_api" {
  fqdn              = local.domain
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = "5"
  request_interval  = "30"

  tags = {
    Name = "shops-api-${terraform.workspace}"
  }
}

resource "aws_cloudwatch_metric_alarm" "shops_api" {
  alarm_name          = "shops-api-alarm-${terraform.workspace}"
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

resource "aws_ssm_parameter" "shops_api_health_check_id" {
  name      = "/greatupsells/${terraform.workspace}/shops-api/health-check-id"
  type      = "String"
  value     = aws_route53_health_check.shops_api.id
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "mongodb_shops_database_url" {
  name      = "/greatupsells/${terraform.workspace}/database/mongodb-shops/url"
  type      = "SecureString"
  value     = "mongodb://app:${var.mongodb_app_password}@${local.mongodb_hosts}/greatupsells-shops?ssl=true&retryWrites=false"
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "shops_api_regional_domain" {
  name      = "/greatupsells/${terraform.workspace}/shops-api/regional-domain"
  type      = "String"
  value     = local.domain
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "shops_api_url" {
  name      = "/greatupsells/${terraform.workspace}/shops-api/url"
  type      = "String"
  value     = "https://${local.domain}"
  overwrite = true
  provider  = aws.region
}
