resource "aws_sqs_queue" "shop_collection_import_dlq" {
  name                      = "shop-collection-import-dlq-${terraform.workspace}"
  message_retention_seconds = 259200 # 3 days
}

resource "aws_sqs_queue" "shop_product_import_dlq" {
  name                      = "shop-product-import-dlq-${terraform.workspace}"
  message_retention_seconds = 259200 # 3 days
}

resource "aws_sqs_queue" "shop_collection_import" {
  name                       = "shop-collection-import-queue-${terraform.workspace}"
  visibility_timeout_seconds = 60
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.shop_collection_import_dlq.arn
    maxReceiveCount     = 10
  })
  provider = aws.region
}

resource "aws_sqs_queue" "shop_product_import" {
  name                       = "shop-product-import-queue-${terraform.workspace}"
  visibility_timeout_seconds = 60
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.shop_product_import_dlq.arn
    maxReceiveCount     = 10
  })
  provider = aws.region
}

resource "aws_sqs_queue_policy" "shop_collection_import_policy" {
  queue_url = aws_sqs_queue.shop_collection_import.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Service" : ["lambda.amazonaws.com"]
        },
        "Action" : "sqs:SendMessage",
        "Resource" : "${aws_sqs_queue.shop_collection_import.arn}"
      }
    ]
  })
  provider = aws.region
}

resource "aws_sqs_queue_policy" "shop_product_import_policy" {
  queue_url = aws_sqs_queue.shop_product_import.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Service" : ["lambda.amazonaws.com"]
        },
        "Action" : "sqs:SendMessage",
        "Resource" : "${aws_sqs_queue.shop_product_import.arn}"
      }
    ]
  })
  provider = aws.region
}

resource "aws_ssm_parameter" "shop_collection_import_queue_arn" {
  name      = "/greatupsells/${terraform.workspace}/queues/shop-collection-import/arn"
  type      = "String"
  value     = aws_sqs_queue.shop_collection_import.arn
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "shop_collection_import_queue_url" {
  name      = "/greatupsells/${terraform.workspace}/queues/shop-collection-import/url"
  type      = "String"
  value     = aws_sqs_queue.shop_collection_import.url
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "shop_product_import_queue_arn" {
  name      = "/greatupsells/${terraform.workspace}/queues/shop-product-import/arn"
  type      = "String"
  value     = aws_sqs_queue.shop_product_import.arn
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "shop_product_import_queue_url" {
  name      = "/greatupsells/${terraform.workspace}/queues/shop-product-import/url"
  type      = "String"
  value     = aws_sqs_queue.shop_product_import.url
  overwrite = true
  provider  = aws.region
}
