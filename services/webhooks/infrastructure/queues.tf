resource "aws_sqs_queue" "app_uninstall" {
  name = "app-uninstall-queue-${terraform.workspace}"
}

resource "aws_sqs_queue" "collection" {
  name = "collection-queue-${terraform.workspace}"
}

resource "aws_sqs_queue" "collection_deletion" {
  name = "collection-queue-${terraform.workspace}"
}

resource "aws_sqs_queue" "order_cancelation" {
  name = "order-cancelation-${terraform.workspace}"
}

resource "aws_sqs_queue" "order_paid" {
  name = "order-paid-${terraform.workspace}"
}

resource "aws_sqs_queue" "order_update" {
  name = "order-update-${terraform.workspace}"
}

resource "aws_sqs_queue" "product" {
  name = "product-${terraform.workspace}"
}

resource "aws_sqs_queue" "product_deletion" {
  name = "product-deletion-${terraform.workspace}"
}

resource "aws_sqs_queue" "shop_update" {
  name = "shop-update-${terraform.workspace}"
}

resource "aws_sqs_queue_policy" "app_uninstall_policy" {
  queue_url = aws_sqs_queue.app_uninstall.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : "*",
        "Action" : "sqs:SendMessage",
        "Resource" : "${aws_sqs_queue.app_uninstall.arn}"
      }
    ]
  })
}

resource "aws_sqs_queue_policy" "collection_policy" {
  queue_url = aws_sqs_queue.collection.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : "*",
        "Action" : "sqs:SendMessage",
        "Resource" : "${aws_sqs_queue.collection.arn}"
      }
    ]
  })
}

resource "aws_sqs_queue_policy" "order_cancelation_policy" {
  queue_url = aws_sqs_queue.order_cancelation.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : "*",
        "Action" : "sqs:SendMessage",
        "Resource" : "${aws_sqs_queue.order_cancelation.arn}"
      }
    ]
  })
}

resource "aws_sqs_queue_policy" "order_paid_policy" {
  queue_url = aws_sqs_queue.order_paid.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : "*",
        "Action" : "sqs:SendMessage",
        "Resource" : "${aws_sqs_queue.order_paid.arn}"
      }
    ]
  })
}

resource "aws_sqs_queue_policy" "order_update_policy" {
  queue_url = aws_sqs_queue.order_update.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : "*",
        "Action" : "sqs:SendMessage",
        "Resource" : "${aws_sqs_queue.order_update.arn}"
      }
    ]
  })
}

resource "aws_sqs_queue_policy" "product_policy" {
  queue_url = aws_sqs_queue.product.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : "*",
        "Action" : "sqs:SendMessage",
        "Resource" : "${aws_sqs_queue.product.arn}"
      }
    ]
  })
}

resource "aws_sqs_queue_policy" "product_deletion_policy" {
  queue_url = aws_sqs_queue.product_deletion.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : "*",
        "Action" : "sqs:SendMessage",
        "Resource" : "${aws_sqs_queue.product_deletion.arn}"
      }
    ]
  })
}

resource "aws_sqs_queue_policy" "shop_update_policy" {
  queue_url = aws_sqs_queue.shop_update.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : "*",
        "Action" : "sqs:SendMessage",
        "Resource" : "${aws_sqs_queue.shop_update.arn}"
      }
    ]
  })
}

resource "aws_ssm_parameter" "app_uninstall_queue_arn" {
  name      = "/upselling/${terraform.workspace}/queues/app-uninstall/arn"
  type      = "String"
  value     = aws_sqs_queue.app_uninstall.arn
  overwrite = true
}

resource "aws_ssm_parameter" "collection_queue_arn" {
  name      = "/upselling/${terraform.workspace}/queues/collection/arn"
  type      = "String"
  value     = aws_sqs_queue.collection.arn
  overwrite = true
}

resource "aws_ssm_parameter" "collection_deletion_queue_arn" {
  name      = "/upselling/${terraform.workspace}/queues/collection-deletion/arn"
  type      = "String"
  value     = aws_sqs_queue.collection_deletion.arn
  overwrite = true
}

resource "aws_ssm_parameter" "order_cancelation_queue_arn" {
  name      = "/upselling/${terraform.workspace}/queues/order-cancelation/arn"
  type      = "String"
  value     = aws_sqs_queue.order_cancelation.arn
  overwrite = true
}

resource "aws_ssm_parameter" "order_paid_queue_arn" {
  name      = "/upselling/${terraform.workspace}/queues/order-paid/arn"
  type      = "String"
  value     = aws_sqs_queue.order_paid.arn
  overwrite = true
}

resource "aws_ssm_parameter" "order_update_queue_arn" {
  name      = "/upselling/${terraform.workspace}/queues/order-update/arn"
  type      = "String"
  value     = aws_sqs_queue.order_update.arn
  overwrite = true
}

resource "aws_ssm_parameter" "product_queue_arn" {
  name      = "/upselling/${terraform.workspace}/queues/product/arn"
  type      = "String"
  value     = aws_sqs_queue.product.arn
  overwrite = true
}

resource "aws_ssm_parameter" "product_deletion_queue_arn" {
  name      = "/upselling/${terraform.workspace}/queues/product-deletion/arn"
  type      = "String"
  value     = aws_sqs_queue.product_deletion.arn
  overwrite = true
}

resource "aws_ssm_parameter" "shop_update_queue_arn" {
  name      = "/upselling/${terraform.workspace}/queues/shop-update/arn"
  type      = "String"
  value     = aws_sqs_queue.shop_update.arn
  overwrite = true
}
