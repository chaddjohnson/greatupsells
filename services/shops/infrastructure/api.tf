resource "aws_ssm_parameter" "mongodb_shops_database_url" {
  name  = "/upselling/${terraform.workspace}/database/mongodb-shops/uri"
  type  = "String"
  value = "" # TODO
}
