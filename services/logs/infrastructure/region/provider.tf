provider "aws" {
  region = "us-east-1"
}

provider "aws" {
  alias  = "region"
  region = "us-east-1"
}

terraform {
  backend "s3" {
    bucket = "greatupsells-infrastructure2"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
}
