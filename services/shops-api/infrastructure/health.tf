resource "aws_route53_health_check" "shops_api" {
  fqdn                            = local.domain
  port                            = 443
  type                            = "HTTPS"
  resource_path                   = "/health"
  failure_threshold               = "5"
  request_interval                = "30"
  regions                         = ["us-east-1", "eu-west-1", "ap-northeast-1"]
  insufficient_data_health_status = "Healthy"

  tags = {
    Name = "shops-api-${terraform.workspace}"
  }
}

resource "aws_cloudwatch_metric_alarm" "shops_api" {
  alarm_name          = "shops-api-alarm-${terraform.workspace}"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "3"
  metric_name         = "HealthyHostCount"
  namespace           = "AWS/Route53"
  period              = "60"
  statistic           = "Minimum"
  threshold           = "18"
  unit                = "Count"
  alarm_actions       = [data.terraform_remote_state.greatupsells_infrastructure.outputs.health_check_alarm_topic_arn]
  ok_actions          = [data.terraform_remote_state.greatupsells_infrastructure.outputs.health_check_alarm_topic_arn]

  dimensions = {
    HealthCheckId = aws_route53_health_check.shops_api.id
  }
}

resource "aws_sns_topic_subscription" "health_check_alarm_topic_subscription" {
  topic_arn = data.terraform_remote_state.greatupsells_infrastructure.outputs.health_check_alarm_topic_arn
  protocol  = "email"
  endpoint  = data.terraform_remote_state.greatupsells_infrastructure.outputs.health_check_alarm_topic_email
}
