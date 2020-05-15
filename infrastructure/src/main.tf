terraform {
  backend "s3" {
    bucket = "neatowebsolutions-upselling-infrastructure"
    key    = "infrastructure.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  version = "= 2.45.0"
  region  = "us-east-1"
}

data "terraform_remote_state" "ecommerce_infrastructure" {
  backend = "s3"
  config = {
    bucket = "neatowebsolutions-ecommerce-infrastructure"
    key    = "infrastructure.tfstate"
    region = "us-east-1"
  }
}
