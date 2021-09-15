resource "aws_ssm_parameter" "certificate_name" {
  name     = "/upselling/${terraform.workspace}/certificate-name"
  type     = "String"
  value    = var.certificate_name
  provider = aws.region
}

resource "aws_ssm_parameter" "sandbox" {
  name     = "/upselling/${terraform.workspace}/sandbox"
  type     = "String"
  value    = var.sandbox
  provider = aws.region
}

resource "aws_ssm_parameter" "jwt_secret" {
  name     = "/upselling/${terraform.workspace}/jwt-secret"
  type     = "SecureString"
  value    = var.jwt_secret
  provider = aws.region
}

resource "aws_ssm_parameter" "assets-url" {
  name     = "/upselling/${terraform.workspace}/assets/url"
  type     = "String"
  value    = var.assets_domain
  provider = aws.us-east-1
}

resource "aws_ssm_parameter" "shopify_admin_app_api_key" {
  name     = "/upselling/${terraform.workspace}/shopify/api-key"
  type     = "String"
  value    = var.shopify_admin_app_api_key
  provider = aws.region
}

resource "aws_ssm_parameter" "shopify_admin_app_api_secret_key" {
  name     = "/upselling/${terraform.workspace}/shopify/api-secret-key"
  type     = "SecureString"
  value    = var.shopify_admin_app_api_secret_key
  provider = aws.region
}

resource "aws_ssm_parameter" "event_bus_arn" {
  name     = "/upselling/${terraform.workspace}/webhooks/arn"
  type     = "String"
  value    = var.event_bus_arn
  provider = aws.region
}
