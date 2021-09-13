resource "aws_ssm_parameter" "storefront_api_domain" {
  name  = "/upselling/${terraform.workspace}/storefront-api/domain"
  type  = "String"
  value = var.storefront_api_url
}

resource "aws_ssm_parameter" "storefront_api_url" {
  name  = "/upselling/${terraform.workspace}/storefront-api/url"
  type  = "String"
  value = "https://${var.storefront_api_url}"
}
