locals {
  mongodb_hosts = "${join(":27017,", data.terraform_remote_state.greatupsells_infrastructure.outputs.services_domain_names)}:27017"
  domain        = "logs-api.${data.aws_region.current.name}.${data.terraform_remote_state.greatupsells_infrastructure.outputs.domain}"
}

resource "aws_ssm_parameter" "elasticsearch_logs_database_url" {
  count     = terraform.workspace == "production" ? 1 : 0
  name      = "/greatupsells/${terraform.workspace}/database/elasticsearch-logs/url"
  type      = "SecureString"
  overwrite = true
  value     = "https://app:${var.elasticsearch_app_password}@services.${data.aws_region.current.name}.${data.terraform_remote_state.greatupsells_infrastructure.outputs.domain}:9200"
}

resource "aws_ssm_parameter" "elasticsearch_logs_database_url" {
  count     = terraform.workspace == "test" ? 1 : 0
  name      = "/greatupsells/${terraform.workspace}/database/elasticsearch-logs/url"
  type      = "SecureString"
  overwrite = true
  value     = "https://app:${var.elasticsearch_app_password}@services.${data.terraform_remote_state.greatupsells_infrastructure.outputs.domain}:9200"
}

resource "aws_ssm_parameter" "mongodb_logs_database_url" {
  name      = "/greatupsells/${terraform.workspace}/database/mongodb-logs/url"
  type      = "SecureString"
  value     = "mongodb://app:${var.mongodb_app_password}@${local.mongodb_hosts}/greatupsells-logs?replicaSet=rs0&readPreference=secondaryPreferred&w=1&wtimeoutMS=5000&ssl=true"
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "logs_api_regional_domain" {
  name      = "/greatupsells/${terraform.workspace}/logs-api/regional-domain"
  type      = "String"
  value     = local.domain
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "logs_api_url" {
  name      = "/greatupsells/${terraform.workspace}/logs-api/url"
  type      = "String"
  value     = "https://${local.domain}"
  overwrite = true
  provider  = aws.region
}
