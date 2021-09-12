locals {
  mongodb_hosts = "${join(":27017,", split(",", data.terraform_remote_state.upselling_infrastructure.outputs.services_domain_names))}:27017"
}

resource "aws_ssm_parameter" "mongodb_shops_database_url" {
  name  = "/upselling/${terraform.workspace}/database/mongodb-shops/uri"
  type  = "String"
  value = "mongodb://app:${var.mongodb_app_password}@${local.mongodb_hosts}/upselling-shops?replicaSet=rs0&ssl=true"
}
