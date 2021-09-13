resource "aws_ssm_parameter" "admin_api_gateway_domain" {
  name  = "/upselling/${terraform.workspace}/admin-api-gateway/domain"
  type  = "String"
  value = var.admin_api_gateway_url
}

resource "aws_ssm_parameter" "admin_api_gateway_url" {
  name  = "/upselling/${terraform.workspace}/admin-api-gateway/url"
  type  = "String"
  value = "https://${var.admin_api_gateway_url}"
}
