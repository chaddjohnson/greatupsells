resource "aws_default_vpc" "default" {
  enable_dns_support   = true
  enable_dns_hostnames = true
}

resource "aws_route53_record" "admin-portal-ipv4" {
  count   = length(split(",", var.services_domain_names))
  zone_id = var.hosted_zone_id
  name    = element(split(",", var.services_domain_names), count.index)
  type    = "A"
  ttl     = 86400
  records = [aws_eip.services_server.public_ip]
}
