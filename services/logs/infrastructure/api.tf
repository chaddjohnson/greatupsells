# TODO Import and use infrastructure outputs for database URLs.

# resource "aws_ssm_parameter" "elasticsearch_logs_database_url" {
#   name  = "/upselling/${terraform.workspace}/database/elasticsearch-logs/uri"
#   type  = "String"
#   value = "" # TODO
# }

# resource "aws_ssm_parameter" "mongodb_logs_database_url" {
#   name  = "/upselling/${terraform.workspace}/database/mongodb-logs/uri"
#   type  = "String"
#   value = "" # TODO
# }

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
