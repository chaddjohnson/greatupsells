# resource "aws_ssm_parameter" "elasticsearch_logs_database_url" {
#   name  = "/upselling/${terraform.workspace}/database/elasticsearch-logs/uri"
#   type  = "String"
#   value = "" # TODO
# }

locals {
  mongodb_hosts = "${join(":27017,", split(",", data.terraform_remote_state.upselling_infrastructure.outputs.services_domain_names))}:27017"
}

resource "aws_ssm_parameter" "mongodb_logs_database_url" {
  name  = "/upselling/${terraform.workspace}/database/mongodb-logs/uri"
  type  = "String"
  value = "mongodb://app:${var.mongodb_app_password}@${local.mongodb_hosts}/upselling-logs?replicaSet=rs0&ssl=true"
}

resource "aws_ssm_parameter" "logs_api_domain" {
  name  = "/upselling/${terraform.workspace}/logs-api/domain"
  type  = "String"
  value = var.logs_service_api_domain
}

resource "aws_ssm_parameter" "logs_api_url" {
  name  = "/upselling/${terraform.workspace}/logs-api/url"
  type  = "String"
  value = "https://${var.logs_service_api_domain}"
}
