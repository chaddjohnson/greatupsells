resource "aws_ssm_parameter" "certificate_name" {
  name      = "/upselling/${terraform.workspace}/certificate-name"
  type      = "String"
  value     = var.certificate_name
  overwrite = true
}

resource "aws_ssm_parameter" "contact_email" {
  name      = "/upselling/${terraform.workspace}/contact-email"
  type      = "String"
  value     = var.contact_email
  overwrite = true
}

resource "aws_ssm_parameter" "jwt_secret" {
  name      = "/upselling/${terraform.workspace}/jwt-secret"
  type      = "SecureString"
  value     = var.jwt_secret
  overwrite = true
}

resource "aws_ssm_parameter" "sandbox" {
  name      = "/upselling/${terraform.workspace}/sandbox"
  type      = "String"
  value     = var.sandbox
  overwrite = true
}

resource "aws_ssm_parameter" "mongodb_database" {
  name      = "/upselling/${terraform.workspace}/database/mongodb/name"
  type      = "String"
  value     = var.mongodb_database
  overwrite = true
}

resource "aws_ssm_parameter" "mongodb_app_user" {
  name      = "/upselling/${terraform.workspace}/database/mongodb/app-user/username"
  type      = "String"
  value     = var.mongodb_app_user
  overwrite = true
}

resource "aws_ssm_parameter" "mongodb_app_password" {
  name      = "/upselling/${terraform.workspace}/database/mongodb/app-user/password"
  type      = "SecureString"
  value     = var.mongodb_app_password
  overwrite = true
}

resource "aws_ssm_parameter" "mongodb_uri" {
  name      = "/upselling/${terraform.workspace}/database/mongodb/uri"
  type      = "SecureString"
  value     = "mongodb://${var.mongodb_app_user}:${var.mongodb_app_password}@${data.terraform_remote_state.ecommerce_infrastructure.outputs.services_server_public_dns}:27017/${var.mongodb_database}"
  overwrite = true
}

resource "aws_ssm_parameter" "shopify_admin_name" {
  name      = "/upselling/${terraform.workspace}/shopify-admin/name"
  type      = "String"
  value     = var.shopify_admin_name
  overwrite = true
}

resource "aws_ssm_parameter" "shopify_admin_url" {
  name      = "/upselling/${terraform.workspace}/shopify-admin/url"
  type      = "String"
  value     = var.shopify_admin_url
  overwrite = true
}

resource "aws_ssm_parameter" "shopify_admin_domain" {
  name      = "/upselling/${terraform.workspace}/shopify-admin/domain"
  type      = "String"
  value     = var.shopify_admin_domain
  overwrite = true
}

resource "aws_ssm_parameter" "shopify_admin_api_key" {
  name      = "/upselling/${terraform.workspace}/shopify-admin/api-key"
  type      = "String"
  value     = var.shopify_admin_api_key
  overwrite = true
}

resource "aws_ssm_parameter" "shopify_admin_api_secret_key" {
  name      = "/upselling/${terraform.workspace}/shopify-admin/api-secret-key"
  type      = "SecureString"
  value     = var.shopify_admin_api_secret_key
  overwrite = true
}

resource "aws_ssm_parameter" "webhooks_api_url" {
  name      = "/upselling/${terraform.workspace}/webhooks-api/url"
  type      = "String"
  value     = var.webhooks_api_url
  overwrite = true
}
