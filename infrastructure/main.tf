terraform {
  backend "s3" {
    bucket = "greatupsells-infrastructure"
    key    = "infrastructure.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

provider "aws" {
  alias  = "us-west-2"
  region = "us-west-2"
}

provider "aws" {
  alias  = "us-east-2"
  region = "us-east-2"
}

provider "aws" {
  alias  = "eu-west-1"
  region = "eu-west-1"
}

provider "aws" {
  alias  = "ap-northeast-1"
  region = "ap-northeast-1"
}

resource "aws_s3_bucket" "backups" {
  bucket        = "greatupsells-backups"
  acl           = "private"
  force_destroy = false

  lifecycle_rule {
    enabled                                = true
    prefix                                 = "database/"
    abort_incomplete_multipart_upload_days = 1

    transition {
      days          = 7
      storage_class = "GLACIER"
    }

    expiration {
      days = 90
    }
  }
}

module "us_east_1" {
  source = "./region"
  providers = {
    aws.region = aws
  }

  region                           = "us-east-1"
  hosted_zone_id                   = var.hosted_zone_id
  base_domain                      = var.base_domain
  instance_type                    = var.instance_type
  sandbox                          = var.sandbox
  jwt_secret                       = var.jwt_secret
  services_domain_name             = lookup(var.services_domain_names, "us-east-1")
  assets_domain                    = var.assets_domain
  shopify_admin_app_api_key        = var.shopify_admin_app_api_key
  shopify_admin_app_api_secret_key = var.shopify_admin_app_api_secret_key
  event_bus_arn                    = var.event_bus_arn
  redis_app_password               = var.redis_app_password
}

module "us_west_2" {
  count  = terraform.workspace == "production" ? 1 : 0
  source = "./region"
  providers = {
    aws.region = aws.us-west-2
  }

  region                           = "us-west-2"
  hosted_zone_id                   = var.hosted_zone_id
  base_domain                      = var.base_domain
  instance_type                    = var.instance_type
  sandbox                          = var.sandbox
  jwt_secret                       = var.jwt_secret
  services_domain_name             = lookup(var.services_domain_names, "us-west-2")
  assets_domain                    = var.assets_domain
  shopify_admin_app_api_key        = var.shopify_admin_app_api_key
  shopify_admin_app_api_secret_key = var.shopify_admin_app_api_secret_key
  event_bus_arn                    = var.event_bus_arn
  redis_app_password               = var.redis_app_password
}

module "us_east_2" {
  count  = terraform.workspace == "production" ? 1 : 0
  source = "./region"
  providers = {
    aws.region = aws.us-east-2
  }

  region                           = "us-east-2"
  hosted_zone_id                   = var.hosted_zone_id
  base_domain                      = var.base_domain
  instance_type                    = var.instance_type
  sandbox                          = var.sandbox
  jwt_secret                       = var.jwt_secret
  services_domain_name             = lookup(var.services_domain_names, "us-east-2")
  assets_domain                    = var.assets_domain
  shopify_admin_app_api_key        = var.shopify_admin_app_api_key
  shopify_admin_app_api_secret_key = var.shopify_admin_app_api_secret_key
  event_bus_arn                    = var.event_bus_arn
  redis_app_password               = var.redis_app_password
}

module "eu_west_1" {
  count  = terraform.workspace == "production" ? 1 : 0
  source = "./region"
  providers = {
    aws.region = aws.eu-west-1
  }

  region                           = "eu-west-1"
  hosted_zone_id                   = var.hosted_zone_id
  base_domain                      = var.base_domain
  instance_type                    = var.instance_type
  sandbox                          = var.sandbox
  jwt_secret                       = var.jwt_secret
  services_domain_name             = lookup(var.services_domain_names, "eu-west-1")
  assets_domain                    = var.assets_domain
  shopify_admin_app_api_key        = var.shopify_admin_app_api_key
  shopify_admin_app_api_secret_key = var.shopify_admin_app_api_secret_key
  event_bus_arn                    = var.event_bus_arn
  redis_app_password               = var.redis_app_password
}

module "ap_northeast_1" {
  count  = terraform.workspace == "production" ? 1 : 0
  source = "./region"
  providers = {
    aws.region = aws.ap-northeast-1
  }

  region                           = "ap-northeast-1"
  hosted_zone_id                   = var.hosted_zone_id
  base_domain                      = var.base_domain
  instance_type                    = var.instance_type
  sandbox                          = var.sandbox
  jwt_secret                       = var.jwt_secret
  services_domain_name             = lookup(var.services_domain_names, "ap-northeast-1")
  assets_domain                    = var.assets_domain
  shopify_admin_app_api_key        = var.shopify_admin_app_api_key
  shopify_admin_app_api_secret_key = var.shopify_admin_app_api_secret_key
  event_bus_arn                    = var.event_bus_arn
  redis_app_password               = var.redis_app_password
}

output "domain" {
  value = var.domain
}

output "assets_domain" {
  value = var.assets_domain
}

output "services_domain_names" {
  value = values(var.services_domain_names)
}
