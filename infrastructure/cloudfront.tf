# ── Response Headers Policies (browser cache-control) ──

# Hashed assets (/assets/*) — immutable, cache for 1 year
resource "aws_cloudfront_response_headers_policy" "immutable_assets" {
  name = "${var.name_prefix}-immutable-assets"

  custom_headers_config {
    items {
      header   = "Cache-Control"
      value    = "public, max-age=31536000, immutable"
      override = true
    }
  }
}



# ── CloudFront Distribution ──

module "cloudfront_public" {
  source            = "git::https://github.com/shaunniee/terraform_modules.git//aws_cloudfront?ref=main"
  aliases           = ["indriyaclinic.com", "www.indriyaclinic.com"]
  acm_certificate_arn = module.acm.validated_certificate_arns["indriyaclinic.com"]
  distribution_name = "${var.name_prefix}-public-distribution"
    default_root_object = "index.html"
    spa_fallback        = true

  spa_fallback_status_codes = [403, 404]

  origins = {
    web = {
      domain_name       = module.public_frontend_bucket.bucket_regional_domain_name
      origin_id         = "web-origin"
      origin_type       = "s3"
      is_private_origin = true
    }

  }

  # Default behavior — CachingOptimized enables Brotli/gzip compression
  default_cache_behavior = {
    target_origin_id = "web-origin"
    cache_policy_id  = "658327ea-f89d-4fab-a63d-7e88639e58f6" # Managed-CachingOptimized
  }

  # Hashed assets — immutable 1-year cache + compression
  ordered_cache_behavior = {
    assets = {
      path_pattern               = "/assets/*"
      target_origin_id           = "web-origin"
      allowed_methods            = ["GET", "HEAD"]
      cached_methods             = ["GET", "HEAD"]
      cache_disabled             = false
      requires_signed_url        = false
      cache_policy_id            = "658327ea-f89d-4fab-a63d-7e88639e58f6" # Managed-CachingOptimized
      response_headers_policy_id = aws_cloudfront_response_headers_policy.immutable_assets.id
    }
  }



    observability = {
    enabled               = true
    enable_default_alarms = true
    enable_dashboard      = false
    default_alarm_actions = [module.cw_sns.topic_arn]
  }

  logging = {
    enabled         = true
    bucket          = module.cloudfront_logging_bucket.bucket_domain_name
    include_cookies = false
    prefix          = "indriya-cloudfront-logs/"
  }

}

# S3 bucket policy to allow CloudFront to read from the public frontend bucket

module "public_frontend_bucket_policy" {
  source = "./iam/cloudfront-bucket-policy"
  bucket_arn = module.public_frontend_bucket.bucket_arn
  bucket_id = module.public_frontend_bucket.bucket_id
  source_arn = module.cloudfront_public.cloudfront_distribution_arn
}

# S3 bucket policy to allow CloudFront to write logs to the logging bucket
module "cloudfront_logging_bucket_policy" {
  source = "./iam/cloudfront-log-bucket-policy"
  bucket_arn = module.cloudfront_logging_bucket.bucket_arn
  bucket_id = module.cloudfront_logging_bucket.bucket_id
  source_arn = module.cloudfront_public.cloudfront_distribution_arn
}
