terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      configuration_aliases = [aws.region]
    }
  }
}

data "aws_region" "current" {
  provider = aws.region
}

data "terraform_remote_state" "upselling_infrastructure" {
  backend = "s3"
  config = {
    bucket = "neatowebsolutions-upselling-infrastructure"
    key    = "env:/${terraform.workspace}/infrastructure.tfstate"
    region = "us-east-1"
  }
}

resource "aws_ssm_parameter" "shopify_admin_api_regional_domain" {
  name      = "/upselling/${terraform.workspace}/shopify-admin-api/regional-domain"
  type      = "String"
  value     = "shopify-admin-api.${data.aws_region.current.name}.${data.terraform_remote_state.upselling_infrastructure.outputs.domain}"
  overwrite = true
  provider  = aws.region
}

resource "aws_ssm_parameter" "shopify_admin_api_url" {
  name      = "/upselling/${terraform.workspace}/shopify-admin-api/url"
  type      = "String"
  value     = "https://${var.shopify_admin_api_domain}"
  overwrite = true
  provider  = aws.region
}

resource "aws_cloudfront_distribution" "shopify_admin_api" {
  enabled     = true
  aliases     = [var.shopify_admin_api_domain]
  price_class = "PriceClass_All"

  origin {
    domain_name = aws_ssm_parameter.shopify_admin_api_regional_domain.value
    origin_id   = "api"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "POST", "PUT", "PATCH", "DELETE"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "api"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress               = false
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true
      headers      = "*"

      cookies {
        forward = "none"
      }
    }
  }

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
    acm_certificate_arn      = data.terraform_remote_state.upselling_infrastructure.outputs.certificate_arn
    minimum_protocol_version = "TLSv1.2_2018"
    ssl_support_method       = "sni-only"
  }
}

resource "aws_route53_health_check" "shopify_admin_api" {
  fqdn              = aws_ssm_parameter.shopify_admin_api_regional_domain.value
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = "5"
  request_interval  = "30"
}

resource "aws_route53_record" "shopify_admin_api" {
  zone_id         = data.terraform_remote_state.upselling_infrastructure.outputs.hosted_zone_id
  name            = var.shopify_admin_api_domain
  type            = "CNAME"
  ttl             = "86400"
  set_identifier  = data.aws_region.current.name
  records         = [aws_cloudfront_distribution.shopify_admin_api.domain_name]
  health_check_id = aws_route53_health_check.shopify_admin_api.id

  latency_routing_policy {
    region = data.aws_region.current.name
  }
}
