resource "aws_s3_bucket" "shopify_admin_us" {
  bucket        = var.shopify_admin_bucket_name_us
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
      "Resource": "arn:aws:s3:::${var.shopify_admin_bucket_name_us}/*"
    }
  ]
}
POLICY
}

resource "aws_s3_bucket" "shopify_admin_asia" {
  bucket        = var.shopify_admin_bucket_name_asia
  acl           = "private"
  region        = "ap-northeast-2"
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
      "Resource": "arn:aws:s3:::${var.shopify_admin_bucket_name_asia}/*"
    }
  ]
}
POLICY
}

resource "aws_s3_bucket" "shopify_admin_europe" {
  bucket        = var.shopify_admin_bucket_name_europe
  acl           = "private"
  region        = "eu-west-1"
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
      "Resource": "arn:aws:s3:::${var.shopify_admin_bucket_name_europe}/*"
    }
  ]
}
POLICY
}
