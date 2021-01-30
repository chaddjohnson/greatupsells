terraform {
  backend "s3" {
    bucket = "neatowebsolutions-upselling-infrastructure"
    key    = "shops-service.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  version = "~> 3.18"
  region  = "us-east-1"
}
