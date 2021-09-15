# resource "aws_ssm_parameter" "elasticsearch_logs_database_url" {
#   name  = "/upselling/${terraform.workspace}/database/elasticsearch-logs/uri"
#   type  = "String"
#   value = "" # TODO
# }

locals {
  mongodb_hosts = "${join(":27017,", data.terraform_remote_state.upselling_infrastructure.outputs.services_domain_names)}:27017"
}

resource "aws_ssm_parameter" "mongodb_logs_database_url" {
  name     = "/upselling/${terraform.workspace}/database/mongodb-logs/uri"
  type     = "String"
  value    = "mongodb://app:${var.mongodb_app_password}@${local.mongodb_hosts}/upselling-logs?replicaSet=rs0&readPreference=secondaryPreferred&ssl=true"
  provider = aws.region
}

resource "aws_ssm_parameter" "logs_api_regional_domain" {
  name     = "/upselling/${terraform.workspace}/logs-api/regional-domain"
  type     = "String"
  value    = "logs-api.${data.aws_region.current.name}.${data.terraform_remote_state.upselling_infrastructure.outputs.domain}"
  provider = aws.region
}

resource "aws_ssm_parameter" "logs_api_url" {
  name     = "/upselling/${terraform.workspace}/logs-api/url"
  type     = "String"
  value    = "https://logs-api.${data.aws_region.current.name}.${data.terraform_remote_state.upselling_infrastructure.outputs.domain}"
  provider = aws.region
}
