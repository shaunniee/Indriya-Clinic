variable "aws_region" {
description = "AWS region for resource deployment"
type = string
default = "ap-south-1"
}

variable "acm_region" {
description = "AWS region for ACM certificate (must be us-east-1 for CloudFront)"
type = string
default = "us-east-1"
}

variable "name_prefix" {
description = "Prefix for naming AWS resources"
type = string
default = "indriya-"
}

variable "hosted_zone_id" {
description = "Route53 Hosted Zone ID for domain validation"
type = string
default = "" # ← replace with your actual hosted zone ID
}