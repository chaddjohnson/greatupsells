terraform {
  backend "s3" {
    bucket = "neatowebsolutions-upselling-infrastructure"
    key    = "shops-service.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

data "terraform_remote_state" "upselling_infrastructure" {
  backend = "s3"
  config = {
    bucket = "neatowebsolutions-upselling-infrastructure"
    key    = "env:/test/infrastructure.tfstate"
    region = "us-east-1"
  }
}
