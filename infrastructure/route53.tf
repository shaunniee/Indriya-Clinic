
module "acm" {
  source = "git::https://github.com/shaunniee/terraform_modules.git//aws_acm?ref=main"

  providers = {
    aws = aws.us_east_1
  }

  certificates = [
    {
      domain_name       = "indriyaclinic.com"
      san               = [
        "*.indriyaclinic.com",
        "www.indriyaclinic.com",
        "admin.indriyaclinic.com",
        "www.admin.indriyaclinic.com"
      ]
      validation_method = "DNS"
      zone_id           = var.hosted_zone_id
    }
  ]
}


module "dns_records" {
  source = "git::https://github.com/shaunniee/terraform_modules.git//aws_route53?ref=main"

  existing_zone_ids = {
    main = var.hosted_zone_id  # ← pass existing zone, don't recreate
  }

  records = {
    main = {
      "indriyaclinic.com" = {
        type = "A"
        alias = {
          name                   = module.cloudfront_public.cloudfront_domain_name
          zone_id                = module.cloudfront_public.cloudfront_hosted_zone_id
          evaluate_target_health = false
        }
      }

      "www.indriyaclinic.com" = {
        type = "A"
        alias = {
          name                   = module.cloudfront_public.cloudfront_domain_name
          zone_id                = module.cloudfront_public.cloudfront_hosted_zone_id
          evaluate_target_health = false
        }
      }

     
      
    }
  }
}