resource "aws_cloudfront_distribution" "shopify_admin" {
  enabled         = true
  is_ipv6_enabled = true
  aliases         = [var.shopify_admin_domain]
  price_class     = var.cdn_price_class
  http_version    = "http2"

  # Static site on S3
  origin {
    domain_name = var.shopify_admin_static_domain
    origin_id   = "static"

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_protocol_policy   = "http-only"
      origin_ssl_protocols     = ["TLSv1.2"]
      origin_keepalive_timeout = 5
      origin_read_timeout      = 30
    }
  }

  # App on API Gateway
  origin {
    domain_name = var.shopify_admin_endpoint
    origin_id   = "app"

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_protocol_policy   = "https-only"
      origin_ssl_protocols     = ["TLSv1.2"]
      origin_keepalive_timeout = 5
      origin_read_timeout      = 30
    }
  }

  # Static app
  ordered_cache_behavior {
    path_pattern           = "*.*"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "static"
    min_ttl                = 0
    default_ttl            = 2628000
    max_ttl                = 31536000
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  # App (default)
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "app"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true

      cookies {
        forward = "all"
      }
    }
  }

  # Cache error responses briefly to evade DDoS attacks.
  # See https://www.bluematador.com/blog/negative-ttl-in-aws-cloudfront

  custom_error_response {
    error_code            = 400
    error_caching_min_ttl = 5
  }

  custom_error_response {
    error_code            = 403
    error_caching_min_ttl = 5
  }

  custom_error_response {
    error_code            = 404
    error_caching_min_ttl = 5
  }

  custom_error_response {
    error_code            = 500
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 501
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 502
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 503
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 504
    error_caching_min_ttl = 0
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }

  viewer_certificate {
    acm_certificate_arn      = var.acm_certificate_arn
    minimum_protocol_version = "TLSv1.2_2018"
    ssl_support_method       = "sni-only"
  }
}

resource "aws_ssm_parameter" "shopify_admin_endpoint_us" {
  name      = "/upselling/${terraform.workspace}/api/endpoint/us-east-1"
  type      = "String"
  value     = var.shopify_admin_endpoint_us
  overwrite = true
}

resource "aws_ssm_parameter" "shopify_admin_endpoint_asia" {
  name      = "/upselling/${terraform.workspace}/api/endpoint/ap-northeast-2"
  type      = "String"
  value     = var.shopify_admin_endpoint_asia
  overwrite = true
}

resource "aws_ssm_parameter" "shopify_admin_endpoint_europe" {
  name      = "/upselling/${terraform.workspace}/api/endpoint/eu-west-1"
  type      = "String"
  value     = var.shopify_admin_endpoint_europe
  overwrite = true
}

resource "aws_route53_health_check" "shopify_admin_us" {
  fqdn              = aws_ssm_parameter.shopify_admin_endpoint_us.value
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = "5"
  request_interval  = "30"

  tags = {
    Name = "shopify-admin-us-health-check-${terraform.workspace}"
  }
}

resource "aws_route53_health_check" "shopify_admin_asia" {
  fqdn              = aws_ssm_parameter.shopify_admin_endpoint_asia.value
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = "5"
  request_interval  = "30"

  tags = {
    Name = "shopify-admin-asia-health-check-${terraform.workspace}"
  }
}

resource "aws_route53_health_check" "shopify_admin_europe" {
  fqdn              = aws_ssm_parameter.shopify_admin_endpoint_europe.value
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = "5"
  request_interval  = "30"

  tags = {
    Name = "shopify-admin-europe-health-check-${terraform.workspace}"
  }
}

resource "aws_route53_record" "shopify_admin_us" {
  zone_id         = var.domain_hosted_zone_id
  name            = var.shopify_admin_endpoint
  type            = "A"
  set_identifier  = "us"
  health_check_id = aws_route53_health_check.shopify_admin_us.id

  alias {
    name                   = aws_ssm_parameter.shopify_admin_endpoint_us.value
    zone_id                = var.domain_hosted_zone_id
    evaluate_target_health = true
  }

  latency_routing_policy {
    region = "us-east-1"
  }
}

resource "aws_route53_record" "shopify_admin_asia" {
  zone_id         = var.domain_hosted_zone_id
  name            = var.shopify_admin_endpoint
  type            = "A"
  set_identifier  = "asia"
  health_check_id = aws_route53_health_check.shopify_admin_asia.id

  alias {
    name                   = aws_ssm_parameter.shopify_admin_endpoint_asia.value
    zone_id                = var.domain_hosted_zone_id
    evaluate_target_health = true
  }

  latency_routing_policy {
    region = "ap-northeast-2"
  }
}

resource "aws_route53_record" "shopify_admin_europe" {
  zone_id         = var.domain_hosted_zone_id
  name            = var.shopify_admin_endpoint
  type            = "A"
  set_identifier  = "europe"
  health_check_id = aws_route53_health_check.shopify_admin_europe.id

  alias {
    name                   = aws_ssm_parameter.shopify_admin_endpoint_europe.value
    zone_id                = var.domain_hosted_zone_id
    evaluate_target_health = true
  }

  latency_routing_policy {
    region = "eu-west-1"
  }
}

resource "aws_route53_record" "shopify_admin" {
  zone_id = var.domain_hosted_zone_id
  name    = var.shopify_admin_domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.shopify_admin.domain_name
    zone_id                = aws_cloudfront_distribution.shopify_admin.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "shopify_admin_ipv6" {
  zone_id = var.domain_hosted_zone_id
  name    = var.shopify_admin_domain
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.shopify_admin.domain_name
    zone_id                = aws_cloudfront_distribution.shopify_admin.hosted_zone_id
    evaluate_target_health = false
  }
}
