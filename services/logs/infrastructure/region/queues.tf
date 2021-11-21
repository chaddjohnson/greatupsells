resource "aws_sqs_queue" "log_dlq" {
  name                      = "log-dlq-${terraform.workspace}"
  message_retention_seconds = 259200 # 3 days
}

resource "aws_sqs_queue" "log" {
  name                       = "log-queue-${terraform.workspace}"
  visibility_timeout_seconds = 900
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.log_dlq.arn
    maxReceiveCount     = 100
  })
  provider = aws.region
}

resource "aws_sqs_queue_policy" "log_policy" {
  queue_url = aws_sqs_queue.log.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : "*",
        "Action" : "sqs:SendMessage",
        "Resource" : "${aws_sqs_queue.log.arn}"
      }
    ]
  })
  provider = aws.region
}

resource "aws_ssm_parameter" "log_queue_arn" {
  name      = "/greatupsells/${terraform.workspace}/queues/log/arn"
  type      = "String"
  value     = aws_sqs_queue.log.arn
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "log_queue_url" {
  name      = "/greatupsells/${terraform.workspace}/queues/log/url"
  type      = "String"
  value     = aws_sqs_queue.log.id
  overwrite = true
  provider  = aws.region
}
