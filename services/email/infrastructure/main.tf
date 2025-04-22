terraform {
  backend "s3" {
    bucket = "greatupsells-infrastructure2"
    key    = "email-service.tfstate"
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

data "terraform_remote_state" "greatupsells_infrastructure" {
  backend = "s3"
  config = {
    bucket = "greatupsells-infrastructure2"
    key    = "env:/${terraform.workspace}/infrastructure.tfstate"
    region = "us-east-1"
  }
}

module "us_east_1" {
  source = "./region"
  providers = {
    aws.region = aws
  }

  gsuite_app_password = var.gsuite_app_password
}

# module "eu_west_1" {
#   count  = terraform.workspace == "prod" ? 1 : 0
#   source = "./region"
#   providers = {
#     aws.region = aws.eu-west-1
#   }
#
#   gsuite_app_password = var.gsuite_app_password
# }

# module "ap_northeast_1" {
#   count  = terraform.workspace == "prod" ? 1 : 0
#   source = "./region"
#   providers = {
#     aws.region = aws.ap-northeast-1
#   }
#
#   gsuite_app_password = var.gsuite_app_password
# }
