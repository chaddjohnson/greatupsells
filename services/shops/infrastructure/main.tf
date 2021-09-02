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
