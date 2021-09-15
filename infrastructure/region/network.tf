resource "aws_default_vpc" "default" {
  enable_dns_support   = true
  enable_dns_hostnames = true
  provider             = aws.region
}

resource "aws_route53_record" "domain_name" {
  zone_id  = var.hosted_zone_id
  name     = var.domain_name
  type     = "A"
  ttl      = 86400
  records  = [aws_eip.services_server.public_ip]
  provider = aws.region
}
