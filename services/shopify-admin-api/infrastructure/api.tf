resource "aws_ssm_parameter" "shopify_admin_api_domain" {
  name  = "/upselling/${terraform.workspace}/shopify-admin-api/domain"
  type  = "String"
  value = var.shopify_admin_api_url
}

resource "aws_ssm_parameter" "shopify_admin_api_url" {
  name  = "/upselling/${terraform.workspace}/shopify-admin-api/url"
  type  = "String"
  value = "https://${var.shopify_admin_api_url}"
}
