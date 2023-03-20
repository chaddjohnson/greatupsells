resource "aws_sns_topic" "health_check_alarm_topic" {
  name     = "health-check-alarm-topic-${terraform.workspace}"
}

output "health_check_alarm_topic_arn" {
  value = aws_sns_topic.health_check_alarm_topic.arn
}

output "health_check_alarm_topic_email" {
  value = var.health_check_alarm_email
}
