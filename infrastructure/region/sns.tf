resource "aws_sns_topic" "health_check_alarm" {
  name     = "health-check-alarm-topic-${terraform.workspace}"
  protocol = "email"
  endpoint = var.health_check_alarm_email
}

output "health_check_alarm_topic_arn" {
  value = aws_sns_topic.arn
}
