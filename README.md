# Indriya Clinic AWS Infrastructure

AWS-first repository for hosting and delivering the Indriya Clinics public website.

Primary scope:

- Infrastructure as code with Terraform
- Secure static hosting on AWS
- Automated CI/CD with CodePipeline and CodeBuild
- Custom domain with CloudFront, ACM, and Route53

## AWS Architecture

This project provisions the following on AWS:

- S3 private bucket for frontend hosting artifacts
- CloudFront distribution with SPA fallback behavior
- ACM certificate in us-east-1 for CloudFront TLS
- Route53 alias records for apex and www domains
- SNS topic for CloudWatch alarm notifications
- CodePipeline + CodeBuild for build and deployment automation

Request flow:

1. User hits indriyaclinic.com or www.indriyaclinic.com
2. Route53 resolves to CloudFront
3. CloudFront serves static assets from private S3 origin
4. SPA route misses are rewritten to index.html

## Repository Layout

```text
.
├── infrastructure/                # Terraform AWS stack
│   ├── main.tf                    # Providers and Terraform version
│   ├── variables.tf               # Input variables
│   ├── dev.tfvars                 # Environment values
│   ├── s3.tf                      # Hosting + log buckets
│   ├── cloudfront.tf              # CDN distribution
│   ├── route53.tf                 # DNS + ACM validation records
│   ├── ci_cd.tf                   # CodePipeline + CodeBuild
│   ├── sns.tf                     # Alarm notifications
│   └── iam/                       # Bucket policy modules
├── buildspec.public-frontend.yml  # Build/deploy instructions for CodeBuild
└── frontend/                      # Website source code (build artifact input)
```

## Infrastructure Deployment

Prerequisites:

- Terraform ~> 1.14
- AWS credentials configured locally
- Existing Route53 hosted zone ID
- Valid CodeStar connection ARN for GitHub integration

Deploy:

```bash
cd infrastructure
terraform init
terraform plan -var-file="dev.tfvars"
terraform apply -var-file="dev.tfvars"
```

## Required Terraform Inputs

Set in dev.tfvars (or per-environment tfvars):

- aws_region
- acm_region (must be us-east-1 for CloudFront)
- name_prefix
- hosted_zone_id
- codestar_connection_arn
- repo_fullId
- repo_branch

## CI/CD Behavior

Pipeline source trigger is configured for:

- frontend/**
- buildspec.public-frontend.yml

Build/deploy sequence:

1. CodeBuild installs frontend dependencies
2. Frontend is built using Vite
3. dist is synced to S3 hosting bucket
4. CloudFront cache invalidation is created

## Security and Ops Notes

- Frontend bucket is private and accessed via CloudFront
- Server-side encryption is enabled on buckets
- Versioning is enabled for hosting and log buckets
- CloudFront access logs are stored in a dedicated S3 log bucket
- CloudWatch alarms notify via SNS email subscription

## Frontend Context (Secondary)

The website is a React + Vite SPA with multilingual support (EN, KN, HI) and WhatsApp-based appointment booking.

For local frontend dev:

```bash
cd frontend
npm install
npm run dev
```

## Domains

- indriyaclinic.com
- www.indriyaclinic.com

## License

No license file is currently configured in this repository.