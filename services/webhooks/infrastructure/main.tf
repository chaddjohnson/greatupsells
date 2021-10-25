terraform {
  backend "s3" {
    bucket = "greatupsells-infrastructure"
    key    = "webhooks-service.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}
