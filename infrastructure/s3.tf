# Define Public Frontend static hosting bucket

module "public_frontend_bucket" {
    source = "git::https://github.com/shaunniee/terraform_modules.git//aws_s3?ref=main"
    bucket_name = "${var.name_prefix}hosting-bucket"
    private_bucket = true
    force_destroy = false
    prevent_destroy = true
    server_side_encryption = {
        enabled = true
        encryption_algorithm = "AES256"
    }
    versioning = {
        enabled = true
    }
    lifecycle_rules = [
        {
            id = "frontend-lifecycle-rule"
            enabled = true
            filter = {
                prefix = "frontend/"
            }
            transition = [
                {
                    days = 30
                    storage_class = "STANDARD_IA"
                }
            ]
        }
    ]
    cors_rules = [
        {
            allowed_headers = ["*"]
            allowed_methods = ["GET", "POST", "PUT", "DELETE"]
            allowed_origins = ["*"]
            expose_headers = []
            max_age_seconds = 3000
        }
    ]

}

# Cloudfront logging bucket

module "cloudfront_logging_bucket" {
    source = "git::https://github.com/shaunniee/terraform_modules.git//aws_s3?ref=main"
    bucket_name = "${var.name_prefix}cloudfront-logging-bucket"
    private_bucket = true
    force_destroy = false
    prevent_destroy = true
    server_side_encryption = {
        enabled = true
        encryption_algorithm = "AES256"
    }
    versioning = {
        enabled = true
    }

       lifecycle_rules = [
        {
            id = "cloudfront-logging-lifecycle-rule"
            enabled = true
            filter = {
                prefix = "indriya-cloudfront-logs/"
            }
            transition = [
                {
                    days = 30
                    storage_class = "STANDARD_IA"
                }
            ]
        }
    ]
}

