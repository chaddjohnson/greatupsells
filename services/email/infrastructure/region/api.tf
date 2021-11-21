locals {
  domain = "email-api.${data.aws_region.current.name}.${data.terraform_remote_state.greatupsells_infrastructure.outputs.domain}"
}

resource "aws_ssm_parameter" "email_api_regional_domain" {
  name      = "/greatupsells/${terraform.workspace}/email-api/regional-domain"
  type      = "String"
  value     = local.domain
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "email_api_url" {
  name      = "/greatupsells/${terraform.workspace}/email-api/url"
  type      = "String"
  value     = "https://${local.domain}"
  overwrite = true
  provider  = aws.region
}
