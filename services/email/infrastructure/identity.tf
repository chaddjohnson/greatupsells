# Create identity.
resource "aws_ses_domain_identity" "domain" {
  domain = data.terraform_remote_state.greatupsells_infrastructure.outputs.domain
}

# Use custom MAIL FROM.
resource "aws_ses_domain_mail_from" "domain" {
  domain           = data.terraform_remote_state.greatupsells_infrastructure.outputs.domain
  mail_from_domain = "mail.${data.terraform_remote_state.greatupsells_infrastructure.outputs.domain}"
}

# Create MX record.
resource "aws_route53_record" "domain_mx" {
  zone_id = data.terraform_remote_state.greatupsells_infrastructure.outputs.hosted_zone_id
  name    = aws_ses_domain_mail_from.domain.mail_from_domain
  type    = "MX"
  ttl     = "300"
  records = ["10 feedback-smtp.us-east-1.amazonses.com"]
}

# Create verification record.
resource "aws_route53_record" "domain_verification_record" {
  zone_id = data.terraform_remote_state.greatupsells_infrastructure.outputs.hosted_zone_id
  name    = aws_ses_domain_mail_from.domain.mail_from_domain
  type    = "MX"
  ttl     = "300"
  records = [aws_ses_domain_identity.domain.verification_token]
}
