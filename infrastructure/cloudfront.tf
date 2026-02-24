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

  default_cache_behavior = {
    target_origin_id = "web-origin"
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
