terraform {
  backend "s3" {
    bucket = "neatowebsolutions-upselling-infrastructure"
    key    = "shops-service.tfstate"
    region = var.region
  }
}

provider "aws" {
  version                     = "~> 3.18"
  region                      = var.region
  s3_force_path_style         = terraform.workspace == "dev"
  skip_credentials_validation = terraform.workspace == "dev"
  skip_metadata_api_check     = terraform.workspace == "dev"
  skip_requesting_account_id  = terraform.workspace == "dev"

  endpoints {
    sqs = terraform.workspace == "dev" ? "http://localhost:4566" : null
    ssm = terraform.workspace == "dev" ? "http://localhost:4566" : null
  }
}
