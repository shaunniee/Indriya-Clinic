# Indriya Clinic

Website and infrastructure for **Indriya Clinics** (Mind & ENT Health Care), including:

- A multilingual React frontend (English, Kannada, Hindi)
- WhatsApp-based appointment booking flow
- Infrastructure as code (Terraform) for AWS hosting and CI/CD

## Project Overview

The public site is a Vite + React single-page application that serves:

- Clinic introduction and services (ENT and Psychiatry)
- Doctor profiles
- Location and clinic hours
- Appointment booking via prefilled WhatsApp message

Infrastructure provisions secure static hosting and delivery using S3 + CloudFront, DNS via Route53, certificate management with ACM, and a CodePipeline/CodeBuild deployment path.

## Repository Structure

```text
.
├── frontend/                     # React + Vite public website
│   ├── src/
│   │   ├── pages/                # Home, booking, 404 pages
│   │   ├── components/           # Shared components (e.g., SEO)
│   │   ├── clinicData.js         # Clinic metadata, doctors, contact
│   │   └── i18n.js               # i18next translation resources
│   ├── public/                   # robots, sitemap, redirects
│   └── package.json
├── infrastructure/               # Terraform for AWS resources
│   ├── main.tf
│   ├── s3.tf
│   ├── cloudfront.tf
│   ├── route53.tf
│   ├── ci_cd.tf
│   └── dev.tfvars
└── buildspec.public-frontend.yml # CodeBuild build/deploy spec
```

## Frontend Stack

- **React 19** + **Vite 7**
- **React Router** for SPA routing
- **i18next + react-i18next** for localization
- **ESLint** for linting

### App Routes

- `/` — Home page
- `/book` — Booking page
- `*` — Not found page

## Local Development

### Prerequisites

- Node.js 20+
- npm 10+

### Run locally

```bash
cd frontend
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

Lint:

```bash
npm run lint
```

## Configuration Notes

Clinic-facing content is primarily maintained in:

- `frontend/src/clinicData.js`
- `frontend/src/i18n.js`

This includes:

- Clinic name, address, map query, and WhatsApp number
- Doctor information
- All UI copy for EN / KN / HI

## Infrastructure (Terraform)

### What gets provisioned

- Private S3 bucket for frontend assets
- CloudFront distribution (SPA fallback enabled)
- ACM certificate (in `us-east-1`) for custom domain
- Route53 records for apex + `www`
- CloudWatch alarm notifications via SNS
- CodePipeline + CodeBuild for automated deployment

### Prerequisites

- Terraform `~> 1.14`
- AWS credentials with required permissions

### Deploy infrastructure

```bash
cd infrastructure
terraform init
terraform plan -var-file="dev.tfvars"
terraform apply -var-file="dev.tfvars"
```

## CI/CD Flow

`ci_cd.tf` configures a pipeline that watches changes to:

- `frontend/**`
- `buildspec.public-frontend.yml`

The build spec installs dependencies, builds the frontend, syncs `dist/` to S3, and invalidates CloudFront cache.

## Domain

Configured for:

- `indriyaclinic.com`
- `www.indriyaclinic.com`

## License

No license file is currently configured in this repository.