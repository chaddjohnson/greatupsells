resource "aws_ssm_parameter" "storefront_api_gateway_domain" {
  name  = "/upselling/${terraform.workspace}/storefront-api-gateway/domain"
  type  = "String"
  value = var.storefront_api_gateway_url
}

resource "aws_ssm_parameter" "storefront_api_gateway_url" {
  name  = "/upselling/${terraform.workspace}/storefront-api-gateway/url"
  type  = "String"
  value = "https://${var.storefront_api_gateway_url}"
}
