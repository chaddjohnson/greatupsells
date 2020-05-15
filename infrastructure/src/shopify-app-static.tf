resource "aws_ssm_parameter" "shopify_app_bucket_domain_us" {
  name      = "/upselling/${terraform.workspace}/shopify-app/bucket/domain/us"
  type      = "String"
  value     = aws_s3_bucket.shopify_app_us.bucket_regional_domain_name
  overwrite = true
}

resource "aws_ssm_parameter" "shopify_app_bucket_domain_asia" {
  name      = "/upselling/${terraform.workspace}/shopify-app/bucket/domain/asia"
  type      = "String"
  value     = aws_s3_bucket.shopify_app_asia.bucket_regional_domain_name
  overwrite = true
}

resource "aws_ssm_parameter" "shopify_app_bucket_domain_europe" {
  name      = "/upselling/${terraform.workspace}/shopify-app/bucket/domain/europe"
  type      = "String"
  value     = aws_s3_bucket.shopify_app_europe.bucket_regional_domain_name
  overwrite = true
}

resource "aws_ssm_parameter" "shopify_app_bucket_name_us" {
  name      = "/upselling/${terraform.workspace}/shopify-app/bucket/name/us"
  type      = "String"
  value     = local.shopify_app_bucket_name_us
  overwrite = true
}

resource "aws_ssm_parameter" "shopify_app_bucket_name_asia" {
  name      = "/upselling/${terraform.workspace}/shopify-app/bucket/name/asia"
  type      = "String"
  value     = local.shopify_app_bucket_name_asia
  overwrite = true
}

resource "aws_ssm_parameter" "shopify_app_bucket_name_europe" {
  name      = "/upselling/${terraform.workspace}/shopify-app/bucket/name/europe"
  type      = "String"
  value     = local.shopify_app_bucket_name_europe
  overwrite = true
}

resource "aws_route53_health_check" "shopify_app_bucket_us" {
  fqdn              = aws_ssm_parameter.shopify_app_bucket_domain_us.value
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health.txt"
  failure_threshold = "5"
  request_interval  = "30"

  tags = {
    Name = "shopify-app-us-health-check-${terraform.workspace}"
  }
}

resource "aws_route53_health_check" "shopify_app_bucket_asia" {
  fqdn              = aws_ssm_parameter.shopify_app_bucket_domain_asia.value
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health.txt"
  failure_threshold = "5"
  request_interval  = "30"

  tags = {
    Name = "shopify-app-asia-health-check-${terraform.workspace}"
  }
}

resource "aws_route53_health_check" "shopify_app_bucket_europe" {
  fqdn              = aws_ssm_parameter.shopify_app_bucket_domain_europe.value
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health.txt"
  failure_threshold = "5"
  request_interval  = "30"

  tags = {
    Name = "shopify-app-europe-health-check-${terraform.workspace}"
  }
}

resource "aws_route53_record" "shopify_app_bucket_us" {
  zone_id         = var.domain_hosted_zone_id
  name            = var.shopify_app_static_domain
  type            = "A"
  set_identifier  = "us"
  health_check_id = aws_route53_health_check.shopify_app_bucket_us.id

  alias {
    name                   = aws_ssm_parameter.shopify_app_bucket_domain_us.value
    zone_id                = var.domain_hosted_zone_id
    evaluate_target_health = true
  }

  latency_routing_policy {
    region = "us-east-1"
  }
}

resource "aws_route53_record" "shopify_app_bucket_asia" {
  zone_id         = var.domain_hosted_zone_id
  name            = var.shopify_app_static_domain
  type            = "A"
  set_identifier  = "asia"
  health_check_id = aws_route53_health_check.shopify_app_bucket_asia.id

  alias {
    name                   = aws_ssm_parameter.shopify_app_bucket_domain_asia.value
    zone_id                = var.domain_hosted_zone_id
    evaluate_target_health = true
  }

  latency_routing_policy {
    region = "ap-northeast-2"
  }
}

resource "aws_route53_record" "shopify_app_bucket_europe" {
  zone_id         = var.domain_hosted_zone_id
  name            = var.shopify_app_static_domain
  type            = "A"
  set_identifier  = "europe"
  health_check_id = aws_route53_health_check.shopify_app_bucket_europe.id

  alias {
    name                   = aws_ssm_parameter.shopify_app_bucket_domain_europe.value
    zone_id                = var.domain_hosted_zone_id
    evaluate_target_health = true
  }

  latency_routing_policy {
    region = "eu-west-1"
  }
}
