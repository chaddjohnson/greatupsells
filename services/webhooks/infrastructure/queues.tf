resource "aws_sqs_queue" "app_uninstall_dlq" {
  name                      = "app-uninstall-dlq-${terraform.workspace}"
  message_retention_seconds = 259200 # 3 days
}

resource "aws_sqs_queue" "collection_dlq" {
  name                      = "collection-dlq-${terraform.workspace}"
  message_retention_seconds = 259200 # 3 days
}

resource "aws_sqs_queue" "collection_deletion_dlq" {
  name                      = "collection-deletion-dlq-${terraform.workspace}"
  message_retention_seconds = 259200 # 3 days
}

resource "aws_sqs_queue" "draft_order_update_dlq" {
  name                      = "draft-order-update-dlq-${terraform.workspace}"
  message_retention_seconds = 259200 # 3 days
}

resource "aws_sqs_queue" "order_cancelation_dlq" {
  name                      = "order-cancelation-dlq-${terraform.workspace}"
  message_retention_seconds = 259200 # 3 days
}

resource "aws_sqs_queue" "order_create_dlq" {
  name                      = "order-create-dlq-${terraform.workspace}"
  message_retention_seconds = 259200 # 3 days
}

resource "aws_sqs_queue" "order_paid_dlq" {
  name                      = "order-paid-dlq-${terraform.workspace}"
  message_retention_seconds = 259200 # 3 days
}

resource "aws_sqs_queue" "order_update_dlq" {
  name                      = "order-update-dlq-${terraform.workspace}"
  message_retention_seconds = 259200 # 3 days
}

resource "aws_sqs_queue" "product_dlq" {
  name                      = "product-dlq-${terraform.workspace}"
  message_retention_seconds = 259200 # 3 days
}

resource "aws_sqs_queue" "product_deletion_dlq" {
  name                      = "product-deletion-dlq-${terraform.workspace}"
  message_retention_seconds = 259200 # 3 days
}

resource "aws_sqs_queue" "shop_update_dlq" {
  name                      = "shop-update-dlq-${terraform.workspace}"
  message_retention_seconds = 259200 # 3 days
}

resource "aws_sqs_queue" "app_subscription_update_dlq" {
  name                      = "app-subscription-update-dlq-${terraform.workspace}"
  message_retention_seconds = 259200 # 3 days
}

resource "aws_sqs_queue" "theme_publish_dlq" {
  name                      = "theme-publish-dlq-${terraform.workspace}"
  message_retention_seconds = 259200 # 3 days
}

resource "aws_sqs_queue" "app_uninstall" {
  name                       = "app-uninstall-queue-${terraform.workspace}"
  visibility_timeout_seconds = 60
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.app_uninstall_dlq.arn
    maxReceiveCount     = 10
  })
}

resource "aws_sqs_queue" "collection" {
  name                       = "collection-queue-${terraform.workspace}"
  visibility_timeout_seconds = 60
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.collection_dlq.arn
    maxReceiveCount     = 10
  })
}

resource "aws_sqs_queue" "collection_deletion" {
  name                       = "collection-deletion-queue-${terraform.workspace}"
  visibility_timeout_seconds = 60
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.collection_deletion_dlq.arn
    maxReceiveCount     = 10
  })
}

resource "aws_sqs_queue" "draft_order_update" {
  name                       = "draft-order-update-queue-${terraform.workspace}"
  visibility_timeout_seconds = 60
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.draft_order_update_dlq.arn
    maxReceiveCount     = 10
  })
}

resource "aws_sqs_queue" "order_cancelation" {
  name                       = "order-cancelation-queue-${terraform.workspace}"
  visibility_timeout_seconds = 60
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.order_cancelation_dlq.arn
    maxReceiveCount     = 10
  })
}

resource "aws_sqs_queue" "order_create" {
  name                       = "order-create-queue-${terraform.workspace}"
  visibility_timeout_seconds = 60
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.order_create_dlq.arn
    maxReceiveCount     = 10
  })
}

resource "aws_sqs_queue" "order_paid" {
  name                       = "order-paid-queue-${terraform.workspace}"
  visibility_timeout_seconds = 60
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.order_paid_dlq.arn
    maxReceiveCount     = 10
  })
}

resource "aws_sqs_queue" "order_update" {
  name                       = "order-update-queue-${terraform.workspace}"
  visibility_timeout_seconds = 60
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.order_update_dlq.arn
    maxReceiveCount     = 10
  })
}

resource "aws_sqs_queue" "product" {
  name                       = "product-queue-${terraform.workspace}"
  visibility_timeout_seconds = 60
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.product_dlq.arn
    maxReceiveCount     = 10
  })
}

resource "aws_sqs_queue" "product_deletion" {
  name                       = "product-deletion-queue-${terraform.workspace}"
  visibility_timeout_seconds = 60
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.product_deletion_dlq.arn
    maxReceiveCount     = 10
  })
}

resource "aws_sqs_queue" "shop_update" {
  name                       = "shop-update-queue-${terraform.workspace}"
  visibility_timeout_seconds = 60
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.shop_update_dlq.arn
    maxReceiveCount     = 10
  })
}

resource "aws_sqs_queue" "app_subscription_update" {
  name                       = "app-subscription-update-queue-${terraform.workspace}"
  visibility_timeout_seconds = 60
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.app_subscription_update_dlq.arn
    maxReceiveCount     = 10
  })
}

resource "aws_sqs_queue" "theme_publish" {
  name                       = "theme-publish-queue-${terraform.workspace}"
  visibility_timeout_seconds = 60
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.theme_publish_dlq.arn
    maxReceiveCount     = 10
  })
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

resource "aws_sqs_queue_policy" "draft_order_update_policy" {
  queue_url = aws_sqs_queue.draft_order_update.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : "*",
        "Action" : "sqs:SendMessage",
        "Resource" : "${aws_sqs_queue.draft_order_update.arn}"
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

resource "aws_sqs_queue_policy" "order_create_policy" {
  queue_url = aws_sqs_queue.order_create.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : "*",
        "Action" : "sqs:SendMessage",
        "Resource" : "${aws_sqs_queue.order_create.arn}"
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

resource "aws_sqs_queue_policy" "app_subscription_update_policy" {
  queue_url = aws_sqs_queue.app_subscription_update.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : "*",
        "Action" : "sqs:SendMessage",
        "Resource" : "${aws_sqs_queue.app_subscription_update.arn}"
      }
    ]
  })
}

resource "aws_sqs_queue_policy" "theme_publish_policy" {
  queue_url = aws_sqs_queue.theme_publish.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : "*",
        "Action" : "sqs:SendMessage",
        "Resource" : "${aws_sqs_queue.theme_publish.arn}"
      }
    ]
  })
}

resource "aws_ssm_parameter" "app_uninstall_queue_arn" {
  name      = "/greatupsells/${terraform.workspace}/queues/app-uninstall/arn"
  type      = "String"
  value     = aws_sqs_queue.app_uninstall.arn
  overwrite = true
}

resource "aws_ssm_parameter" "collection_queue_arn" {
  name      = "/greatupsells/${terraform.workspace}/queues/collection/arn"
  type      = "String"
  value     = aws_sqs_queue.collection.arn
  overwrite = true
}

resource "aws_ssm_parameter" "collection_deletion_queue_arn" {
  name      = "/greatupsells/${terraform.workspace}/queues/collection-deletion/arn"
  type      = "String"
  value     = aws_sqs_queue.collection_deletion.arn
  overwrite = true
}

resource "aws_ssm_parameter" "draft_order_update_queue_arn" {
  name      = "/greatupsells/${terraform.workspace}/queues/draft-order-update/arn"
  type      = "String"
  value     = aws_sqs_queue.draft_order_update.arn
  overwrite = true
}

resource "aws_ssm_parameter" "order_cancelation_queue_arn" {
  name      = "/greatupsells/${terraform.workspace}/queues/order-cancelation/arn"
  type      = "String"
  value     = aws_sqs_queue.order_cancelation.arn
  overwrite = true
}

resource "aws_ssm_parameter" "order_create_queue_arn" {
  name      = "/greatupsells/${terraform.workspace}/queues/order-create/arn"
  type      = "String"
  value     = aws_sqs_queue.order_create.arn
  overwrite = true
}

resource "aws_ssm_parameter" "order_paid_queue_arn" {
  name      = "/greatupsells/${terraform.workspace}/queues/order-paid/arn"
  type      = "String"
  value     = aws_sqs_queue.order_paid.arn
  overwrite = true
}

resource "aws_ssm_parameter" "order_update_queue_arn" {
  name      = "/greatupsells/${terraform.workspace}/queues/order-update/arn"
  type      = "String"
  value     = aws_sqs_queue.order_update.arn
  overwrite = true
}

resource "aws_ssm_parameter" "product_queue_arn" {
  name      = "/greatupsells/${terraform.workspace}/queues/product/arn"
  type      = "String"
  value     = aws_sqs_queue.product.arn
  overwrite = true
}

resource "aws_ssm_parameter" "product_deletion_queue_arn" {
  name      = "/greatupsells/${terraform.workspace}/queues/product-deletion/arn"
  type      = "String"
  value     = aws_sqs_queue.product_deletion.arn
  overwrite = true
}

resource "aws_ssm_parameter" "shop_update_queue_arn" {
  name      = "/greatupsells/${terraform.workspace}/queues/shop-update/arn"
  type      = "String"
  value     = aws_sqs_queue.shop_update.arn
  overwrite = true
}

resource "aws_ssm_parameter" "app_subscription_update_queue_arn" {
  name      = "/greatupsells/${terraform.workspace}/queues/app-subscription-update/arn"
  type      = "String"
  value     = aws_sqs_queue.app_subscription_update.arn
  overwrite = true
}

resource "aws_ssm_parameter" "theme_publish_queue_arn" {
  name      = "/greatupsells/${terraform.workspace}/queues/theme-publish/arn"
  type      = "String"
  value     = aws_sqs_queue.theme_publish.arn
  overwrite = true
}
