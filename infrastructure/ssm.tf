resource "aws_ssm_parameter" "certificate_name" {
  name  = "/upselling/${terraform.workspace}/certificate-name"
  type  = "String"
  value = var.certificate_name
}

resource "aws_ssm_parameter" "sandbox" {
  name  = "/upselling/${terraform.workspace}/sandbox"
  type  = "String"
  value = var.sandbox
}

resource "aws_ssm_parameter" "jwt_secret" {
  name  = "/upselling/${terraform.workspace}/jwt-secret"
  type  = "SecureString"
  value = var.jwt_secret
}

resource "aws_ssm_parameter" "shopify_admin_app_api_key" {
  name  = "/upselling/${terraform.workspace}/shopify/api-key"
  type  = "String"
  value = var.shopify_admin_app_api_key
}

resource "aws_ssm_parameter" "shopify_admin_app_api_secret_key" {
  name  = "/upselling/${terraform.workspace}/shopify/api-secret-key"
  type  = "SecureString"
  value = var.shopify_admin_app_api_secret_key
}

resource "aws_ssm_parameter" "shopify_admin_app_url" {
  name  = "/upselling/${terraform.workspace}/shopify-admin/url"
  type  = "String"
  value = var.shopify_admin_app_url
}

resource "aws_ssm_parameter" "shops_api_domain" {
  name  = "/upselling/${terraform.workspace}/shops-api/domain"
  type  = "String"
  value = var.shops_service_api_domain
}

resource "aws_ssm_parameter" "shops_api_url" {
  name  = "/upselling/${terraform.workspace}/shops-api/url"
  type  = "String"
  value = "https://${var.shops_service_api_domain}"
}
