data "aws_lambda_function" "host_lambda" {
  function_name = "cloudfront-host-${terraform.workspace}"
  qualifier     = aws_lambda_function.host_lambda.version
}

resource "aws_iam_role" "cloudfront_lambda_role" {
  name = "cloudfront-lambda-role-${terraform.workspace}"
  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "LambdaCloudFrontRole",
        "Action" : "sts:AssumeRole",
        "Principal" : {
          "Service" : [
            "lambda.amazonaws.com",
            "edgelambda.amazonaws.com"
          ]
        },
        "Effect" : "Allow"
      }
    ]
  })
}

resource "aws_lambda_function" "host_lambda" {
  filename      = "host-lambda.zip"
  function_name = "cloudfront-host-${terraform.workspace}"
  role          = aws_iam_role.cloudfront_lambda_role.arn
  handler       = "host.handler"
  runtime       = "nodejs14.x"
  memory_size   = 128
  timeout       = 3
  publish       = true
}

output "host_lambda_arn" {
  value = data.aws_lambda_function.host_lambda.qualified_arn
}
