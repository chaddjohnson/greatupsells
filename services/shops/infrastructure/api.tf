resource "aws_ssm_parameter" "mongodb_shops_database_url" {
  name  = "/upselling/${terraform.workspace}/database/mongodb-shops/uri"
  type  = "String"
  value = "mongodb://app:${var.mongodb_app_password}@${data.terraform_remote_state.upselling_infrastructure.outputs.services_server_public_dns}:27017/upselling-shops?replicaSet=rs0&ssl=true"
}
