locals {
  mongodb_hosts = "${join(":27017,", data.terraform_remote_state.upselling_infrastructure.outputs.services_domain_names)}:27017"
  domain        = "shops-api.${data.aws_region.current.name}.${data.terraform_remote_state.upselling_infrastructure.outputs.domain}"
}

resource "aws_ssm_parameter" "mongodb_shops_database_url" {
  name      = "/upselling/${terraform.workspace}/database/mongodb-shops/url"
  type      = "SecureString"
  value     = "mongodb://app:${var.mongodb_app_password}@${local.mongodb_hosts}/upselling-shops?replicaSet=rs0&readPreference=secondaryPreferred&w=1&wtimeoutMS=5000&ssl=true"
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "shops_api_regional_domain" {
  name      = "/upselling/${terraform.workspace}/shops-api/regional-domain"
  type      = "String"
  value     = local.domain
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "shops_api_url" {
  name      = "/upselling/${terraform.workspace}/shops-api/url"
  type      = "String"
  value     = "https://${local.domain}"
  overwrite = true
  provider  = aws.region
}
