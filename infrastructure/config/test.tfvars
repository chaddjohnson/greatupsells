certificate_arn  = "arn:aws:acm:us-east-1:174585217681:certificate/def51b2c-579c-49dd-9901-5c2acb6c466f"
certificate_name = "*.greatupsells.com"
hosted_zone_id   = "Z023060413ODYTHFNWZW8"
domain           = "test.greatupsells.com"
instance_type    = "t3a.medium"
sandbox          = "true"
jwt_secret       = "85576eb20045603e3fac6800d4f0aff35d5a7477397b3a43e14f2f087205f6bc"
services_domain_names = {
  "us-east-1" = "services.test.greatupsells.com"
}
assets_domain                    = "assets.test.greatupsells.com"
shopify_admin_app_api_key        = "973752778780866d1cbbbabb75b3401c"
shopify_admin_app_api_secret_key = "c83f0620743c0e2ba66477f615486c2b"
event_bus_arn                    = "arn:aws:events:us-east-1:174585217681:event-bus/aws.partner/shopify.com/3309183/upselling-webhooks-test"
