resource "aws_sqs_queue" "shop_collection_import_queue" {
  name                       = "shop-collection-import-queue-${terraform.workspace}"
  visibility_timeout_seconds = 900
  redrive_policy             = "{\"deadLetterTargetArn\":\"${aws_sqs_queue.shop_collection_import_queue_dlq.arn}\",\"maxReceiveCount\":100}"
}

resource "aws_sqs_queue" "shop_collection_import_queue_dlq" {
  name                      = "shop-collection-import-queue-dlq-${terraform.workspace}"
  message_retention_seconds = 1209600 # 14 days
}

resource "aws_sqs_queue_policy" "shop_collection_import_queue_policy" {
  queue_url = "${aws_sqs_queue.shop_collection_import_queue.id}"
  policy    = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "sqs:SendMessage",
      "Resource": "${aws_sqs_queue.shop_collection_import_queue.arn}"
    }
  ]
}
EOF
}

resource "aws_ssm_parameter" "shop_collection_import_queue_arn" {
  name  = "/upselling/${terraform.workspace}/shop-collection-import-queue-arn"
  type  = "String"
  value = "${aws_sqs_queue.shop_collection_import_queue.arn}"
}

resource "aws_ssm_parameter" "shop_collection_import_queue_url" {
  name  = "/upselling/${terraform.workspace}/shop-collection-import-queue-url"
  type  = "String"
  value = "${aws_sqs_queue.shop_collection_import_queue.id}"
}
