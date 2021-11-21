resource "aws_sqs_queue" "email" {
  name     = "email-queue-${terraform.workspace}"
  provider = aws.region
}

resource "aws_sqs_queue_policy" "email_policy" {
  queue_url = aws_sqs_queue.email.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : "*",
        "Action" : "sqs:SendMessage",
        "Resource" : "${aws_sqs_queue.email.arn}"
      }
    ]
  })
  provider = aws.region
}

resource "aws_ssm_parameter" "email_queue_arn" {
  name      = "/greatupsells/${terraform.workspace}/queues/email/arn"
  type      = "String"
  value     = aws_sqs_queue.email.arn
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "email_queue_url" {
  name      = "/greatupsells/${terraform.workspace}/queues/email/url"
  type      = "String"
  value     = aws_sqs_queue.email.id
  overwrite = true
  provider  = aws.region
}
