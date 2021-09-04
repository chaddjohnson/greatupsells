resource "aws_ssm_parameter" "certificate_name" {
  name  = "/upselling/${terraform.workspace}/certificate-name"
  type  = "String"
  value = var.certificate_name
}
