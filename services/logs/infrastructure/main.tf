terraform {
  backend "s3" {
    bucket = "greatupsells-infrastructure2"
    key    = "logs-service.tfstate"
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

  elasticsearch_app_password = var.elasticsearch_app_password
  mongodb_app_password       = var.mongodb_app_password
  logs_notification_email    = var.logs_notification_email
}

# module "eu_west_1" {
#   count  = terraform.workspace == "production" ? 1 : 0
#   source = "./region"
#   providers = {
#     aws.region = aws.eu-west-1
#   }

#   elasticsearch_app_password = var.elasticsearch_app_password
#   mongodb_app_password       = var.mongodb_app_password
#   logs_notification_email    = var.logs_notification_email
# }

# module "ap_northeast_1" {
#   count  = terraform.workspace == "production" ? 1 : 0
#   source = "./region"
#   providers = {
#     aws.region = aws.ap-northeast-1
#   }

#   elasticsearch_app_password = var.elasticsearch_app_password
#   mongodb_app_password       = var.mongodb_app_password
#   logs_notification_email    = var.logs_notification_email
# }
