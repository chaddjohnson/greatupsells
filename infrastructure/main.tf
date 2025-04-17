terraform {
  backend "s3" {
    bucket = "greatupsells-infrastructure2"
    key    = "infrastructure.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

# provider "aws" {
#   alias  = "eu-west-1"
#   region = "eu-west-1"
# }

# provider "aws" {
#   alias  = "ap-northeast-1"
#   region = "ap-northeast-1"
# }

module "us_east_1" {
  source = "./region"
  providers = {
    aws.region = aws
  }

  region                           = "us-east-1"
  public_key                       = var.public_key
  app_name                         = var.app_name
  app_name_slug                    = var.app_name_slug
  hosted_zone_id                   = aws_route53_zone.domain.zone_id
  base_domain                      = var.base_domain
  domain                           = var.domain
  instance_type                    = var.instance_type
  sandbox                          = var.sandbox
  jwt_secret                       = var.jwt_secret
  services_domain                  = lookup(var.services_domains, "us-east-1")
  assets_domain                    = var.assets_domain
  shopify_admin_app_api_key        = var.shopify_admin_app_api_key
  shopify_admin_app_api_secret_key = var.shopify_admin_app_api_secret_key
  shopify_post_purchase_id         = var.shopify_post_purchase_id
  event_bus_arn                    = var.event_bus_arn

  depends_on = [aws_route53_zone.domain]
}

# module "eu_west_1" {
#   count  = terraform.workspace == "prod" ? 1 : 0
#   source = "./region"
#   providers = {
#     aws.region = aws.eu-west-1
#   }

#   region                           = "eu-west-1"
#   public_key                       = var.public_key
#   app_name                         = var.app_name
#   app_name_slug                    = var.app_name_slug
#   hosted_zone_id                   = aws_route53_zone.domain.zone_id
#   base_domain                      = var.base_domain
#   domain                           = var.domain
#   instance_type                    = var.instance_type
#   sandbox                          = var.sandbox
#   jwt_secret                       = var.jwt_secret
#   services_domain                  = lookup(var.services_domains, "eu-west-1")
#   assets_domain                    = var.assets_domain
#   shopify_admin_app_api_key        = var.shopify_admin_app_api_key
#   shopify_admin_app_api_secret_key = var.shopify_admin_app_api_secret_key
#   shopify_post_purchase_id         = var.shopify_post_purchase_id
#   event_bus_arn                    = var.event_bus_arn

#   depends_on = [aws_route53_zone.domain]
# }

# module "ap_northeast_1" {
#   count  = terraform.workspace == "prod" ? 1 : 0
#   source = "./region"
#   providers = {
#     aws.region = aws.ap-northeast-1
#   }

#   region                           = "ap-northeast-1"
#   public_key                       = var.public_key
#   app_name                         = var.app_name
#   app_name_slug                    = var.app_name_slug
#   hosted_zone_id                   = aws_route53_zone.domain.zone_id
#   base_domain                      = var.base_domain
#   domain                           = var.domain
#   instance_type                    = var.instance_type
#   sandbox                          = var.sandbox
#   jwt_secret                       = var.jwt_secret
#   services_domain                  = lookup(var.services_domains, "ap-northeast-1")
#   assets_domain                    = var.assets_domain
#   shopify_admin_app_api_key        = var.shopify_admin_app_api_key
#   shopify_admin_app_api_secret_key = var.shopify_admin_app_api_secret_key
#   shopify_post_purchase_id         = var.shopify_post_purchase_id
#   event_bus_arn                    = var.event_bus_arn

#   depends_on = [aws_route53_zone.domain]
# }

output "hosted_zone_id" {
  value = aws_route53_zone.domain.zone_id
}

output "domain" {
  value = var.domain
}

output "assets_domain" {
  value = var.assets_domain
}

output "services_domains" {
  value = values(var.services_domains)
}

output "certificate_arn" {
  value = module.us_east_1.certificate_arn
}

output "health_check_alarm_topic_arn_us-east-1" {
  value = module.us_east_1.health_check_alarm_topic_arn
}

# output "health_check_alarm_topic_arn_eu-west-1" {
#   value = terraform.workspace == "prod" ? module.eu_west_1.health_check_alarm_topic_arn : null
# }

# output "health_check_alarm_topic_arn_ap-northeast-1" {
#   value = terraform.workspace == "prod" ? module.ap_northeast_1.health_check_alarm_topic_arn : null
# }

output "health_check_alarm_topic_email" {
  value = var.health_check_alarm_email
}
