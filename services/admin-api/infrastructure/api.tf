resource "aws_ssm_parameter" "admin_api_domain" {
  name  = "/upselling/${terraform.workspace}/admin-api/domain"
  type  = "String"
  value = var.admin_api_url
}

resource "aws_ssm_parameter" "admin_api_url" {
  name  = "/upselling/${terraform.workspace}/admin-api/url"
  type  = "String"
  value = "https://${var.admin_api_url}"
}
