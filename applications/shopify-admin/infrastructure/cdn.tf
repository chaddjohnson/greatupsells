resource "aws_cloudfront_distribution" "shopify_admin" {
  enabled     = true
  aliases     = [var.shopify_admin_app_domain]
  price_class = "PriceClass_All"

  origin {
    domain_name = data.terraform_remote_state.greatupsells_infrastructure.outputs.assets_bucket_regional_domain_name
    origin_id   = "assets"
    origin_path = "/shopify-admin"

    s3_origin_config {
      origin_access_identity = data.terraform_remote_state.greatupsells_infrastructure.outputs.assets_cloudfront_access_identity_path
    }
  }

  origin {
    domain_name = "shopify-admin.latency.${data.terraform_remote_state.greatupsells_infrastructure.outputs.domain}"
    origin_id   = "app"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  origin_group {
    origin_id = "assets-app"

    failover_criteria {
      status_codes = [403, 404]
    }

    member {
      origin_id = "assets"
    }

    member {
      origin_id = "app"
    }
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "POST", "PUT", "DELETE", "PATCH"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    target_origin_id       = "assets-app"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true

      cookies {
        forward = "all"
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
    acm_certificate_arn      = data.terraform_remote_state.greatupsells_infrastructure.outputs.certificate_arn
    minimum_protocol_version = "TLSv1.2_2018"
    ssl_support_method       = "sni-only"
  }
}

resource "aws_route53_record" "shopify_admin" {
  zone_id = data.terraform_remote_state.greatupsells_infrastructure.outputs.hosted_zone_id
  name    = var.shopify_admin_app_domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.shopify_admin.domain_name
    zone_id                = aws_cloudfront_distribution.shopify_admin.hosted_zone_id
    evaluate_target_health = false
  }
}
