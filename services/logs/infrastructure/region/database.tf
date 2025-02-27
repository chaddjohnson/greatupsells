locals {
  mongodb_hosts = "${join(":27017,", data.terraform_remote_state.greatupsells_infrastructure.outputs.services_domains)}:27017"
}

resource "aws_ssm_parameter" "elasticsearch_logs_database_url_production" {
  count     = terraform.workspace == "production" ? 1 : 0
  name      = "/greatupsells/${terraform.workspace}/database/elasticsearch-logs/url"
  type      = "SecureString"
  value     = "https://app:${var.elasticsearch_app_password}@services.${data.aws_region.current.name}.${data.terraform_remote_state.greatupsells_infrastructure.outputs.domain}:9200"
  overwrite = true
}

resource "aws_ssm_parameter" "elasticsearch_logs_database_url_test" {
  count     = terraform.workspace == "test" ? 1 : 0
  name      = "/greatupsells/${terraform.workspace}/database/elasticsearch-logs/url"
  type      = "SecureString"
  value     = "https://app:${var.elasticsearch_app_password}@services.${data.terraform_remote_state.greatupsells_infrastructure.outputs.domain}:9200"
  overwrite = true
}

resource "aws_ssm_parameter" "mongodb_logs_database_url" {
  name      = "/greatupsells/${terraform.workspace}/database/mongodb-logs/url"
  type      = "SecureString"
  value     = "mongodb://app:${var.mongodb_app_password}@${local.mongodb_hosts}/greatupsells-logs?replicaSet=rs0&readPreference=secondaryPreferred&w=1&wtimeoutMS=5000&ssl=true"
  overwrite = true
  provider  = aws.region
}
