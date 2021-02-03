resource "aws_sqs_queue" "shop_collection_import" {
  name = "shop-collection-import-queue-${terraform.workspace}"
}

resource "aws_sqs_queue" "shop_product_import" {
  name = "shop-product-import-queue-${terraform.workspace}"
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
