resource "aws_s3_bucket" "backups" {
  bucket           = "greatupsells-backups2"
  force_destroy    = false
}

resource "aws_s3_bucket_ownership_controls" "backups" {
  bucket = aws_s3_bucket.backups.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
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
