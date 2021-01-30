resource "aws_iam_role" "services_consumer_role" {
  name               = "services_consumer_role"
  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogStream",
                "logs:CreateLogGroup",
                "logs:PutLogEvents"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

resource "aws_ssm_parameter" "services_consumer_role_arn" {
  name  = "/upselling/${terraform.workspace}/roles/services-consumer-arn"
  type  = "String"
  value = aws_iam_role.services_consumer_role.arn
}
