resource "aws_ssm_parameter" "event_bus_arn" {
  name  = "/upselling/${terraform.workspace}/webhooks/arn"
  type  = "String"
  value = var.event_bus_arn
}

resource "aws_cloudwatch_event_rule" "app_uninstall" {
  name           = "app-uninstall-webhook"
  event_bus_name = var.event_bus_name
  event_pattern = jsonencode({
    "detail-type" : [
      "shopifyWebhook"
    ],
    "detail" : {
      "metadata" : {
        "X-Shopify-Topic" : [
          "app/uninstalled"
        ]
      }
    }
  })
}

resource "aws_cloudwatch_event_rule" "collection_creation" {
  name           = "collection-creation-webhook"
  event_bus_name = var.event_bus_name
  event_pattern = jsonencode({
    "detail-type" : [
      "shopifyWebhook"
    ],
    "detail" : {
      "metadata" : {
        "X-Shopify-Topic" : [
          "collections/create"
        ]
      }
    }
  })
}

resource "aws_cloudwatch_event_rule" "collection_deletion" {
  name           = "collection-deletion-webhook"
  event_bus_name = var.event_bus_name
  event_pattern = jsonencode({
    "detail-type" : [
      "shopifyWebhook"
    ],
    "detail" : {
      "metadata" : {
        "X-Shopify-Topic" : [
          "collections/delete"
        ]
      }
    }
  })
}

resource "aws_cloudwatch_event_rule" "collection_update" {
  name           = "collection-update-webhook"
  event_bus_name = var.event_bus_name
  event_pattern = jsonencode({
    "detail-type" : [
      "shopifyWebhook"
    ],
    "detail" : {
      "metadata" : {
        "X-Shopify-Topic" : [
          "collections/update"
        ]
      }
    }
  })
}

resource "aws_cloudwatch_event_rule" "order_cancelation" {
  name           = "order-cancelation-webhook"
  event_bus_name = var.event_bus_name
  event_pattern = jsonencode({
    "detail-type" : [
      "shopifyWebhook"
    ],
    "detail" : {
      "metadata" : {
        "X-Shopify-Topic" : [
          "orders/cancelled"
        ]
      }
    }
  })
}

resource "aws_cloudwatch_event_rule" "order_paid" {
  name           = "order-paid-webhook"
  event_bus_name = var.event_bus_name
  event_pattern = jsonencode({
    "detail-type" : [
      "shopifyWebhook"
    ],
    "detail" : {
      "metadata" : {
        "X-Shopify-Topic" : [
          "orders/paid"
        ]
      }
    }
  })
}

resource "aws_cloudwatch_event_rule" "order_update" {
  name           = "order-update-webhook"
  event_bus_name = var.event_bus_name
  event_pattern = jsonencode({
    "detail-type" : [
      "shopifyWebhook"
    ],
    "detail" : {
      "metadata" : {
        "X-Shopify-Topic" : [
          "orders/updated"
        ]
      }
    }
  })
}

resource "aws_cloudwatch_event_rule" "product_creation" {
  name           = "product-creation-webhook"
  event_bus_name = var.event_bus_name
  event_pattern = jsonencode({
    "detail-type" : [
      "shopifyWebhook"
    ],
    "detail" : {
      "metadata" : {
        "X-Shopify-Topic" : [
          "products/create"
        ]
      }
    }
  })
}

resource "aws_cloudwatch_event_rule" "product_deletion" {
  name           = "product-deletion-webhook"
  event_bus_name = var.event_bus_name
  event_pattern = jsonencode({
    "detail-type" : [
      "shopifyWebhook"
    ],
    "detail" : {
      "metadata" : {
        "X-Shopify-Topic" : [
          "products/delete"
        ]
      }
    }
  })
}

resource "aws_cloudwatch_event_rule" "product_update" {
  name           = "product-update-webhook"
  event_bus_name = var.event_bus_name
  event_pattern = jsonencode({
    "detail-type" : [
      "shopifyWebhook"
    ],
    "detail" : {
      "metadata" : {
        "X-Shopify-Topic" : [
          "products/update"
        ]
      }
    }
  })
}

resource "aws_cloudwatch_event_rule" "shop_update" {
  name           = "shop-update-webhook"
  event_bus_name = var.event_bus_name
  event_pattern = jsonencode({
    "detail-type" : [
      "shopifyWebhook"
    ],
    "detail" : {
      "metadata" : {
        "X-Shopify-Topic" : [
          "shop/update"
        ]
      }
    }
  })
}

resource "aws_cloudwatch_event_target" "app_uninstall" {
  target_id = "app-uninstall"
  rule      = aws_cloudwatch_event_rule.app_uninstall.name
  arn       = aws_sqs_queue.app_uninstall.arn
}

resource "aws_cloudwatch_event_target" "collection_creation" {
  target_id = "collection-creation"
  rule      = aws_cloudwatch_event_rule.collection_creation.name
  arn       = aws_sqs_queue.collection.arn
}

resource "aws_cloudwatch_event_target" "collection_deletion" {
  target_id = "collection-deletion"
  rule      = aws_cloudwatch_event_rule.collection_deletion.name
  arn       = aws_sqs_queue.collection_deletion.arn
}

resource "aws_cloudwatch_event_target" "collection_update" {
  target_id = "collection-update"
  rule      = aws_cloudwatch_event_rule.collection_update.name
  arn       = aws_sqs_queue.collection.arn
}

resource "aws_cloudwatch_event_target" "order_cancelation" {
  target_id = "order-cancelation"
  rule      = aws_cloudwatch_event_rule.order_cancelation.name
  arn       = aws_sqs_queue.order_cancelation.arn
}

resource "aws_cloudwatch_event_target" "order_paid" {
  target_id = "order-paid"
  rule      = aws_cloudwatch_event_rule.order_paid.name
  arn       = aws_sqs_queue.order_paid.arn
}

resource "aws_cloudwatch_event_target" "order_update" {
  target_id = "order-update"
  rule      = aws_cloudwatch_event_rule.order_update.name
  arn       = aws_sqs_queue.order_update.arn
}

resource "aws_cloudwatch_event_target" "product_creation" {
  target_id = "product-creation"
  rule      = aws_cloudwatch_event_rule.product_creation.name
  arn       = aws_sqs_queue.product.arn
}

resource "aws_cloudwatch_event_target" "product_deletion" {
  target_id = "product-deletion"
  rule      = aws_cloudwatch_event_rule.product_deletion.name
  arn       = aws_sqs_queue.product_deletion.arn
}

resource "aws_cloudwatch_event_target" "product_update" {
  target_id = "product-update"
  rule      = aws_cloudwatch_event_rule.product_update.name
  arn       = aws_sqs_queue.product.arn
}

resource "aws_cloudwatch_event_target" "shop_update" {
  target_id = "shop-update"
  rule      = aws_cloudwatch_event_rule.shop_update.name
  arn       = aws_sqs_queue.shop_update.arn
}
