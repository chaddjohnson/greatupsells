terraform {
  backend "s3" {
    bucket = "neatowebsolutions-upselling-infrastructure"
    key    = "shopify-admin-api.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

provider "aws" {
  alias  = "eu-west-1"
  region = "eu-west-1"
}

provider "aws" {
  alias  = "ap-northeast-1"
  region = "ap-northeast-1"
}

module "api_us_east_1" {
  source = "./region"
  providers = {
    aws.region = aws
  }
  shopify_admin_api_domain = var.shopify_admin_api_domain
}

module "api_eu_west_1" {
  count  = terraform.workspace == "production" ? 1 : 0
  source = "./region"
  providers = {
    aws.region = aws.eu-west-1
  }
  shopify_admin_api_domain = var.shopify_admin_api_domain
}

module "api_ap_northeast_1" {
  count  = terraform.workspace == "production" ? 1 : 0
  source = "./region"
  providers = {
    aws.region = aws.ap-northeast-1
  }
  shopify_admin_api_domain = var.shopify_admin_api_domain
}
