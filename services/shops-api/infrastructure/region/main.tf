terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      configuration_aliases = [aws.region]
    }
  }
}

data "aws_region" "current" {
  provider = aws.region
}

data "terraform_remote_state" "greatupsells_infrastructure" {
  backend = "s3"
  config = {
    bucket = "greatupsells-infrastructure"
    key    = "env:/${terraform.workspace}/infrastructure.tfstate"
    region = "us-east-1"
  }
}

resource "aws_ssm_parameter" "shops_api_health_check_id" {
  name      = "/greatupsells/${terraform.workspace}/shops-api/health-check-id"
  type      = "String"
  value     = aws_route53_health_check.shops_api.id
  overwrite = true
  provider  = aws.region
}
