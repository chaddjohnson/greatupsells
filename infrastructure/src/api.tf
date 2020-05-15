resource "aws_ssm_parameter" "api_url" {
  name      = "/upselling/${terraform.workspace}/api/url"
  type      = "String"
  value     = var.api_url
  overwrite = true
}

resource "aws_ssm_parameter" "api_domain" {
  name      = "/upselling/${terraform.workspace}/api/domain"
  type      = "String"
  value     = var.api_domain
  overwrite = true
}

resource "aws_ssm_parameter" "api_endpoint_us" {
  name      = "/upselling/${terraform.workspace}/api/endpoint/us-east-1"
  type      = "String"
  value     = var.api_endpoint_us
  overwrite = true
}

resource "aws_ssm_parameter" "api_endpoint_asia" {
  name      = "/upselling/${terraform.workspace}/api/endpoint/ap-northeast-2"
  type      = "String"
  value     = var.api_endpoint_asia
  overwrite = true
}

resource "aws_ssm_parameter" "api_endpoint_europe" {
  name      = "/upselling/${terraform.workspace}/api/endpoint/eu-west-1"
  type      = "String"
  value     = var.api_endpoint_europe
  overwrite = true
}

resource "aws_route53_health_check" "api_us" {
  fqdn              = aws_ssm_parameter.api_endpoint_us.value
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = "5"
  request_interval  = "30"

  tags = {
    Name = "api-us-health-check-${terraform.workspace}"
  }
}

resource "aws_route53_health_check" "api_asia" {
  fqdn              = aws_ssm_parameter.api_endpoint_asia.value
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = "5"
  request_interval  = "30"

  tags = {
    Name = "api-asia-health-check-${terraform.workspace}"
  }
}

resource "aws_route53_health_check" "api_europe" {
  fqdn              = aws_ssm_parameter.api_endpoint_europe.value
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = "5"
  request_interval  = "30"

  tags = {
    Name = "api-europe-health-check-${terraform.workspace}"
  }
}

resource "aws_route53_record" "api_us" {
  zone_id         = var.domain_hosted_zone_id
  name            = var.api_domain
  type            = "A"
  set_identifier  = "us"
  health_check_id = aws_route53_health_check.api_us.id

  alias {
    name                   = aws_ssm_parameter.api_endpoint_us.value
    zone_id                = var.domain_hosted_zone_id
    evaluate_target_health = true
  }

  latency_routing_policy {
    region = "us-east-1"
  }
}

resource "aws_route53_record" "api_asia" {
  zone_id         = var.domain_hosted_zone_id
  name            = var.api_domain
  type            = "A"
  set_identifier  = "asia"
  health_check_id = aws_route53_health_check.api_asia.id

  alias {
    name                   = aws_ssm_parameter.api_endpoint_asia.value
    zone_id                = var.domain_hosted_zone_id
    evaluate_target_health = true
  }

  latency_routing_policy {
    region = "ap-northeast-2"
  }
}

resource "aws_route53_record" "api_europe" {
  zone_id         = var.domain_hosted_zone_id
  name            = var.api_domain
  type            = "A"
  set_identifier  = "europe"
  health_check_id = aws_route53_health_check.api_europe.id

  alias {
    name                   = aws_ssm_parameter.api_endpoint_europe.value
    zone_id                = var.domain_hosted_zone_id
    evaluate_target_health = true
  }

  latency_routing_policy {
    region = "eu-west-1"
  }
}
