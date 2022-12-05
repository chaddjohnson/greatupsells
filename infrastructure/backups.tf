resource "aws_s3_bucket" "backups" {
  bucket        = "greatupsells-backups"
  force_destroy = false
}

resource "aws_s3_bucket_lifecycle_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id

  rule {
    id                                     = "database-backup-rule"
    status                                 = "Enabled"

    filter {
      prefix = "database/"
    }

    transition {
      days          = 7
      storage_class = "GLACIER"
    }

    expiration {
      days = 90
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 1
    }
  }
}

resource "aws_s3_bucket_acl" "backups" {
  bucket = aws_s3_bucket.backups.id
  acl    = "private"
}
