resource "aws_ssm_parameter" "shopify_admin_api_gateway_domain" {
  name  = "/upselling/${terraform.workspace}/shopify-admin-api-gateway/domain"
  type  = "String"
  value = var.shopify_admin_api_gateway_url
}

resource "aws_ssm_parameter" "shopify_admin_api_gateway_url" {
  name  = "/upselling/${terraform.workspace}/shopify-admin-api-gateway/url"
  type  = "String"
  value = "https://${var.shopify_admin_api_gateway_url}"
}
