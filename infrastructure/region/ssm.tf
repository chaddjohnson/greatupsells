resource "aws_ssm_parameter" "base_domain" {
  name      = "/greatupsells/${terraform.workspace}/base-domain"
  type      = "String"
  value     = var.base_domain
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "certificate_name" {
  name      = "/greatupsells/${terraform.workspace}/certificate-name"
  type      = "String"
  value     = var.base_domain
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "sandbox" {
  name      = "/greatupsells/${terraform.workspace}/sandbox"
  type      = "String"
  value     = var.sandbox
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "jwt_secret" {
  name      = "/greatupsells/${terraform.workspace}/jwt-secret"
  type      = "SecureString"
  value     = var.jwt_secret
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "assets_domain" {
  name      = "/greatupsells/${terraform.workspace}/assets/domain"
  type      = "String"
  value     = var.assets_domain
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "assets_url" {
  name      = "/greatupsells/${terraform.workspace}/assets/url"
  type      = "String"
  value     = "https://${var.assets_domain}"
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "shopify_admin_app_api_key" {
  name      = "/greatupsells/${terraform.workspace}/shopify/api-key"
  type      = "String"
  value     = var.shopify_admin_app_api_key
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "shopify_admin_app_api_secret_key" {
  name      = "/greatupsells/${terraform.workspace}/shopify/api-secret-key"
  type      = "SecureString"
  value     = var.shopify_admin_app_api_secret_key
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "event_bus_arn" {
  name      = "/greatupsells/${terraform.workspace}/webhooks/arn"
  type      = "String"
  value     = var.event_bus_arn
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "redis_app_database_url" {
  name      = "/greatupsells/${terraform.workspace}/database/redis-app/url"
  type      = "SecureString"
  value     = "rediss://:${var.redis_app_password}@${var.services_domain_name}:6379/0?ssl=true&sslprotocols=Tls12"
  overwrite = true
  provider  = aws.region
}
