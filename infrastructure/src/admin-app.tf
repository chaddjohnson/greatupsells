resource "aws_s3_bucket" "admin_app" {
  bucket        = var.admin_app_bucket_name
  acl           = "private"
  region        = "us-east-1"
  force_destroy = true
  policy        = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "MakeItPublic",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${var.admin_app_bucket_name}/*"
    }
  ]
}
POLICY
}

resource "aws_cloudfront_distribution" "admin_app" {
  enabled         = true
  is_ipv6_enabled = true
  aliases         = [var.admin_app_domain]
  price_class     = var.cdn_price_class
  http_version    = "http2"

  # Static site on S3
  origin {
    domain_name = aws_s3_bucket.admin_app.bucket_regional_domain_name
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
    domain_name = var.admin_app_endpoint
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

resource "aws_ssm_parameter" "admin_app_domain" {
  name      = "/upselling/${terraform.workspace}/admin-app/domain"
  type      = "String"
  value     = var.admin_app_domain
  overwrite = true
}

resource "aws_ssm_parameter" "admin_bucket_name" {
  name      = "/upselling/${terraform.workspace}/admin-app/bucket/name"
  type      = "String"
  value     = local.admin_app_bucket_name
  overwrite = true
}

resource "aws_route53_record" "admin_app" {
  zone_id = var.domain_hosted_zone_id
  name    = var.admin_app_domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.admin_app.domain_name
    zone_id                = aws_cloudfront_distribution.admin_app.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "admin_app_ipv6" {
  zone_id = var.domain_hosted_zone_id
  name    = var.admin_app_domain
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.admin_app.domain_name
    zone_id                = aws_cloudfront_distribution.admin_app.hosted_zone_id
    evaluate_target_health = false
  }
}
