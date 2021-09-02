resource "aws_sqs_queue" "shop_collection_import" {
  name = "shop-collection-import-queue-${terraform.workspace}"
}

resource "aws_sqs_queue" "shop_product_import" {
  name = "shop-product-import-queue-${terraform.workspace}"
}

resource "aws_sqs_queue_policy" "shop_collection_import_policy" {
  queue_url = "${aws_sqs_queue.shop_collection_import.id}"
  policy    = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "sqs:SendMessage",
      "Resource": "${aws_sqs_queue.shop_collection_import.arn}"
    }
  ]
}
EOF
}

resource "aws_sqs_queue_policy" "shop_product_import_policy" {
  queue_url = "${aws_sqs_queue.shop_product_import.id}"
  policy    = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "sqs:SendMessage",
      "Resource": "${aws_sqs_queue.shop_product_import.arn}"
    }
  ]
}
EOF
}

resource "aws_ssm_parameter" "shop_collection_import_queue_arn" {
  name  = "/upselling/${terraform.workspace}/queues/shop-collection-import/arn"
  type  = "String"
  value = aws_sqs_queue.shop_collection_import.arn
}

resource "aws_ssm_parameter" "shop_product_import_queue_arn" {
  name  = "/upselling/${terraform.workspace}/queues/shop-product-import/arn"
  type  = "String"
  value = aws_sqs_queue.shop_product_import.arn
}
