# Create S3 bucket for storing emails.
resource "aws_s3_bucket" "email" {
  bucket        = var.email_bucket
  acl           = "private"
  force_destroy = false
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "ses.amazonaws.com"
        },
        "Action" : "s3:PutObject",
        "Resource" : "arn:aws:s3:::${var.email_bucket}/*"
      }
    ]
  })
}

resource "aws_iam_role" "forward_lambda_role" {
  name = "forward-lambda-role-${terraform.workspace}"
  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        "Resource" : "arn:aws:logs:*:*:*"
      },
      {
        "Effect" : "Allow",
        "Action" : "ses:SendRawEmail",
        "Resource" : "*"
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "s3:GetObject",
          "s3:PutObject"
        ],
        "Resource" : "arn:aws:s3:::${var.email_bucket}/*"
      }
    ]
  })
}

resource "aws_lambda_function" "forward" {
  filename      = "infrastructure/forward.zip"
  function_name = "forward-${terraform.workspace}"
  role          = aws_iam_role.forward_lambda_role.arn
  handler       = "forward.handler"
  runtime       = "nodejs14.x"
  memory_size   = 128
  timeout       = 10
  publish       = true
}

# Create inbound MX record.
resource "aws_route53_record" "inbound_mx" {
  zone_id = data.terraform_remote_state.greatupsells_infrastructure.outputs.hosted_zone_id
  name    = data.terraform_remote_state.greatupsells_infrastructure.outputs.domain
  type    = "MX"
  ttl     = "300"
  records = ["10 inbound-smtp.us-east-1.amazonaws.com"]
}

resource "aws_ses_receipt_rule_set" "forward_rules" {
  rule_set_name = "forward-rules"
}

resource "aws_ses_receipt_rule" "forward_rules_support" {
  name          = "store"
  rule_set_name = "forward-rules"
  recipients = [
    var.info_email,
    var.support_email,
    data.terraform_remote_state.greatupsells_infrastructure.outputs.domain
  ]
  enabled      = true
  scan_enabled = true

  s3_action {
    bucket_name       = var.email_bucket
    object_key_prefix = "messages/"
    position          = 1
  }

  lambda_action {
    function_arn    = aws_lambda_function.forward.arn
    invocation_type = "Event"
    position        = 2
  }
}
