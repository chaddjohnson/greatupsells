terraform {
  backend "s3" {
    bucket = "neatowebsolutions-upselling-infrastructure"
    key    = "infrastructure.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  alias  = "us-east-1"
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
  count         = terraform.workspace == "production" ? 1 : 0
  bucket        = "neatowebsolutions-upselling-backups"
  acl           = "private"
  force_destroy = false
  provider      = aws.us-east-1

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

module "api_us_east_1" {
  source = "./region"
  providers = {
    aws.region = aws.us-east-1
  }
  certificate_arn                  = var.certificate_arn
  certificate_name                 = var.certificate_name
  hosted_zone_id                   = var.hosted_zone_id
  instance_type                    = var.instance_type
  sandbox                          = var.sandbox
  jwt_secret                       = var.jwt_secret
  domain_name                      = lookup(var.services_domain_names, "us-east-1")
  assets_domain                    = var.assets_domain
  shopify_admin_app_api_key        = var.shopify_admin_app_api_key
  shopify_admin_app_api_secret_key = var.shopify_admin_app_api_secret_key
  shopify_admin_app_url            = var.shopify_admin_app_url
  event_bus_arn                    = var.event_bus_arn
}

module "api_us_west_2" {
  count  = terraform.workspace == "production" ? 1 : 0
  source = "./region"
  providers = {
    aws.region = aws.us-west-2
  }
  certificate_arn                  = var.certificate_arn
  certificate_name                 = var.certificate_name
  hosted_zone_id                   = var.hosted_zone_id
  instance_type                    = var.instance_type
  sandbox                          = var.sandbox
  jwt_secret                       = var.jwt_secret
  domain_name                      = lookup(var.services_domain_names, "us-west-2")
  assets_domain                    = var.assets_domain
  shopify_admin_app_api_key        = var.shopify_admin_app_api_key
  shopify_admin_app_api_secret_key = var.shopify_admin_app_api_secret_key
  shopify_admin_app_url            = var.shopify_admin_app_url
  event_bus_arn                    = var.event_bus_arn
}

module "api_us_east_2" {
  count  = terraform.workspace == "production" ? 1 : 0
  source = "./region"
  providers = {
    aws.region = aws.us-east-2
  }
  certificate_arn                  = var.certificate_arn
  certificate_name                 = var.certificate_name
  hosted_zone_id                   = var.hosted_zone_id
  instance_type                    = var.instance_type
  sandbox                          = var.sandbox
  jwt_secret                       = var.jwt_secret
  domain_name                      = lookup(var.services_domain_names, "us-east-2")
  assets_domain                    = var.assets_domain
  shopify_admin_app_api_key        = var.shopify_admin_app_api_key
  shopify_admin_app_api_secret_key = var.shopify_admin_app_api_secret_key
  shopify_admin_app_url            = var.shopify_admin_app_url
  event_bus_arn                    = var.event_bus_arn
}

module "api_eu_west_1" {
  count  = terraform.workspace == "production" ? 1 : 0
  source = "./region"
  providers = {
    aws.region = aws.eu-west-1
  }
  certificate_arn                  = var.certificate_arn
  certificate_name                 = var.certificate_name
  hosted_zone_id                   = var.hosted_zone_id
  instance_type                    = var.instance_type
  sandbox                          = var.sandbox
  jwt_secret                       = var.jwt_secret
  domain_name                      = lookup(var.services_domain_names, "eu-west-1")
  assets_domain                    = var.assets_domain
  shopify_admin_app_api_key        = var.shopify_admin_app_api_key
  shopify_admin_app_api_secret_key = var.shopify_admin_app_api_secret_key
  shopify_admin_app_url            = var.shopify_admin_app_url
  event_bus_arn                    = var.event_bus_arn
}

module "api_ap_northeast_1" {
  count  = terraform.workspace == "production" ? 1 : 0
  source = "./region"
  providers = {
    aws.region = aws.ap-northeast-1
  }
  certificate_arn                  = var.certificate_arn
  certificate_name                 = var.certificate_name
  hosted_zone_id                   = var.hosted_zone_id
  instance_type                    = var.instance_type
  sandbox                          = var.sandbox
  jwt_secret                       = var.jwt_secret
  domain_name                      = lookup(var.services_domain_names, "ap-northeast-1")
  assets_domain                    = var.assets_domain
  shopify_admin_app_api_key        = var.shopify_admin_app_api_key
  shopify_admin_app_api_secret_key = var.shopify_admin_app_api_secret_key
  shopify_admin_app_url            = var.shopify_admin_app_url
  event_bus_arn                    = var.event_bus_arn
}

output "hosted_zone_id" {
  value = var.hosted_zone_id
}

output "domain" {
  value = var.domain
}

output "services_domain_names" {
  value = values(var.services_domain_names)
}
