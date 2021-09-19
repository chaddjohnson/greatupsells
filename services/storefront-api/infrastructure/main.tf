terraform {
  backend "s3" {
    bucket = "neatowebsolutions-upselling-infrastructure"
    key    = "storefront-api.tfstate"
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

module "us_east_1" {
  source = "./region"
  providers = {
    aws.region = aws
  }
  storefront_api_domain = var.storefront_api_domain
}

module "eu_west_1" {
  count  = terraform.workspace == "production" ? 1 : 0
  source = "./region"
  providers = {
    aws.region = aws.eu-west-1
  }
  storefront_api_domain = var.storefront_api_domain
}

module "ap_northeast_1" {
  count  = terraform.workspace == "production" ? 1 : 0
  source = "./region"
  providers = {
    aws.region = aws.ap-northeast-1
  }
  storefront_api_domain = var.storefront_api_domain
}
