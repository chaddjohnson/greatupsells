terraform {
  backend "s3" {
    bucket = "neatowebsolutions-upselling-infrastructure"
    key    = "shops-service.tfstate"
    region = var.region
  }
}

provider "aws" {
  version = "~> 3.18"
  region  = var.region
}
