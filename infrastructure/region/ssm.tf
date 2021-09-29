resource "aws_ssm_parameter" "certificate_name" {
  name      = "/upselling/${terraform.workspace}/certificate-name"
  type      = "String"
  value     = "greatupsells.com"
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "sandbox" {
  name      = "/upselling/${terraform.workspace}/sandbox"
  type      = "String"
  value     = var.sandbox
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "jwt_secret" {
  name      = "/upselling/${terraform.workspace}/jwt-secret"
  type      = "SecureString"
  value     = var.jwt_secret
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "assets_domain" {
  name      = "/upselling/${terraform.workspace}/assets/domain"
  type      = "String"
  value     = var.assets_domain
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "assets_url" {
  name      = "/upselling/${terraform.workspace}/assets/url"
  type      = "String"
  value     = "https://${var.assets_domain}"
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "shopify_admin_app_api_key" {
  name      = "/upselling/${terraform.workspace}/shopify/api-key"
  type      = "String"
  value     = var.shopify_admin_app_api_key
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "shopify_admin_app_api_secret_key" {
  name      = "/upselling/${terraform.workspace}/shopify/api-secret-key"
  type      = "SecureString"
  value     = var.shopify_admin_app_api_secret_key
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "event_bus_arn" {
  name      = "/upselling/${terraform.workspace}/webhooks/arn"
  type      = "String"
  value     = var.event_bus_arn
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "redis_app_database_url" {
  name      = "/upselling/${terraform.workspace}/database/redis-app/url"
  type      = "SecureString"
  value     = "redis://app:${var.redis_app_password}@${var.services_domain_name}:6379/0?ssl=true&sslprotocols=Tls12"
  overwrite = true
  provider  = aws.region
}
