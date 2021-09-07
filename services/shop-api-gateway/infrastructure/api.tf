resource "aws_ssm_parameter" "shop_api_gateway_url" {
  name  = "/upselling/${terraform.workspace}/shop-api-gateway/url"
  type  = "String"
  value = var.shop_api_gateway_url
}
