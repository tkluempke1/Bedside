# Bedside

Bedside is an emerging platform that allows patients and caregivers to share their care experiences with hospitals, clinics and individual clinicians without revealing their identity.  By combining subjective reviews with objective quality measures from public data sets, Bedside aims to help the healthcare community make more informed decisions while holding providers accountable in a privacy‑respecting way.

## Why Bedside?

Healthcare quality is hard to assess when information is siloed.  Traditional review sites often focus only on subjective ratings and do not provide context such as HCAHPS star scores, readmission rates or QPP/MIPS performance.  Bedside addresses these gaps by:

* **Anonymous but verified contributions** – Users can contribute structured reviews across dimensions such as communication, responsiveness and cleanliness, optionally adding free‑text narratives.  Identity and review content are stored separately.  An attestation step and future verification flows (e.g. account linking, encounter verification) deter fake or incentivised reviews.
* **Objective measures alongside stories** – Profiles for facilities and clinicians display curated metrics from CMS Care Compare, QPP/MIPS and other public datasets so that readers can weigh quantitative quality indicators alongside patient comments.
* **Provider participation** – Hospitals and clinicians will be able to claim their profiles and respond using HIPAA‑safe templates.  A “give‑to‑get” model unlocks deeper content for providers who contribute data or verify their accounts.
* **Trust & safety by design** – The project is built with moderation hooks, anti‑brigading measures and privacy best practices.  Reviews are checked before publication, and providers cannot see contributors’ identities.

> **Note:** This repository contains an early proof‑of‑concept scaffold.  Many features described above (claim flows, verification, full data ingestion, moderation, analytics, etc.) are not yet implemented.  See the [product specification](./Bedside.pdf.pdf) for the full scope.

## Monorepo Layout

This repository uses a Yarn/NPM workspaces structure to organise the front‑end and back‑end applications, along with shared packages.  At a glance:

```
bedside/
├── apps/
│   ├── web/         # Next.js 14 app (client/server components)
│   └── api/         # NestJS REST API service
├── packages/
│   ├── ui/          # Shared React UI components (SearchBar, RatingStars)
│   └── schemas/     # Zod schemas shared between FE/BE (e.g. reviewSchema)
├── infra/           # IaC (Terraform modules) – not yet implemented
├── scripts/         # Utility scripts (currently empty)
└── README.md        # You are here
```

### `apps/web` – Front‑end

The front‑end is built with **Next.js 14** using the [App Router](https://nextjs.org/docs/app/building-your-application/routing) and React server components.  It uses **TailwindCSS** for styling, **React Query** for data fetching and caching, and leverages TypeScript throughout.  Key pages include:

* **Search and landing page (`/`)** – Provides a search bar for facilities or clinicians.  Results are fetched via the API based on the query string.
* **Facility detail page (`/facility/[id]`)** – Displays basic details, objective measures, ratings and recent reviews for a specific facility.  Example endpoint: `/api/v1/facilities/{id}`.
* **Clinician detail page (`/clinician/[npi]`)** – Similar to the facility page but for individual providers, keyed off the NPI (National Provider Identifier).
* **Write review page (`/write-review`)** – Presents a multi‑section form allowing contributors to rate multiple dimensions, specify encounter details and submit free text.  Client‑side validation uses a shared Zod schema imported from `packages/schemas`.

Providers for React Query and other client‑side context live in `app/providers.tsx` and are wired up in `app/layout.tsx`.  Styling is defined in `globals.css` and configured via `tailwind.config.js`.

### `apps/api` – Back‑end

The back‑end is a **NestJS** application exposing a small REST API.  The API currently operates on in‑memory data defined in `src/data/sample-data.ts`.  In production this should be replaced by a **PostgreSQL** database with entities such as users, facilities, clinicians, reviews and verification events.  The API sets a global prefix of `/api/v1` to version routes.

Existing endpoints include:

| Method & path | Description |
|--------------|------------|
| **GET /api/v1/facilities?query=string** | Search facilities by name.  Returns all facilities when `query` is omitted. |
| **GET /api/v1/facilities/{id}** | Retrieve a facility by ID, including its objective measures and associated reviews. |
| **GET /api/v1/clinicians?name=string&npi=string** | Search clinicians by full name or exact NPI.  Passing `npi` returns the specific clinician if found. |
| **GET /api/v1/clinicians/{npi}** | Retrieve a clinician by NPI, including objective measures and associated reviews. |
| **POST /api/v1/reviews** | Create a new review.  The request body must conform to the `reviewSchema` defined in `packages/schemas`.  The service will validate the payload, ensure the target exists, persist the review and recompute the average rating. |

Controllers for these endpoints live in `src/controllers`, and the corresponding services live in `src/services`.  The application entry point (`src/main.ts`) bootstraps the Nest server and applies the `/api/v1` prefix.

### `packages/ui` – Shared UI components

Reusable React components live here.  Two examples included in this scaffold are:

* **SearchBar** – A simple text input component that emits changes to its parent.  It does not implement its own debouncing; call sites can add throttling or debouncing if needed.
* **RatingStars** – Renders a row of five stars (Unicode glyphs) to represent fractional ratings.  Half stars are supported by rendering a hollow star for the fractional part.

These components are exported via `packages/ui/src/index.ts` and consumed by the Next.js app.

### `packages/schemas` – Shared Zod schemas

This package contains TypeScript/Zod definitions for validating request/response payloads.  The primary schema in this scaffold is `reviewSchema` which enforces:

* `target_type` – either `"facility"` or `"clinician"`.
* `target_id` – non‑empty string representing the facility ID or clinician NPI.
* `encounter_setting` – one of `"inpatient"`, `"outpatient"` or `"ed"`.
* `encounter_month` – ISO `YYYY-MM` string representing the month of the encounter.
* `overall` – integer rating between 1 and 5.
* `would_recommend` – boolean.
* `dimensions` – nested object with ratings for communication, responsiveness, cleanliness, discharge info, wait time and empathy.
* `text` – optional free text with a maximum length of 5 000 characters.
* `tags` – optional string array.
* `attestation` – must be `true` (ensures that the user attests their submission is honest and compliant with community guidelines).

The API’s review service and the front‑end’s submission form both import this schema to ensure consistency.

## Getting Started

### Prerequisites

* **Node.js ≥ 20** and **npm ≥ 9**.
* (Optional) **PostgreSQL 15** if you wish to implement persistence via Prisma.  By default the API uses in‑memory storage for demonstration.

### Install dependencies

From the repository root, install all package dependencies using workspaces:

```bash
npm install
```

This will install dependencies for the root and all nested workspaces.  The `workspace:` version specifiers ensure that the `@bedside/ui` and `@bedside/schemas` packages resolve to the local packages.

### Development

Run the API and web servers concurrently in separate terminals:

```bash
# Start the API service on http://localhost:3001
npm run dev:api

# Start the web application on http://localhost:3000
npm run dev:web
```

The web app is configured to make API calls relative to the origin (e.g. `/api/v1/facilities`).  When running locally, the front‑end will proxy requests to `http://localhost:3001` if you configure a reverse proxy or update the `NEXT_PUBLIC_API_BASE_URL` environment variable as necessary.

If you choose to use Prisma with PostgreSQL, set a `DATABASE_URL` environment variable before running migrations:

```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/bedside"
cd apps/api
npx prisma generate
npx prisma migrate dev --name init
```

### Building for production

To produce compiled JavaScript for both the web and API applications, run:

```bash
npm run build
```

This will execute `next build` in `apps/web` and TypeScript compilation in `apps/api`.  Deployment to production would typically involve containerising each service (e.g. Docker images) and using infrastructure such as AWS Fargate or Vercel, along with secure secrets management and CI/CD pipelines.

## Contributing & Next Steps

This scaffold only scratches the surface of what Bedside aims to become.  Contributions are welcome!  Here are some ideas for future enhancements:

* **Persist data** – Replace the in‑memory sample data with a real PostgreSQL database using Prisma models that reflect the domain entities (users, profiles, facilities, clinicians, reviews, verification events, etc.).
* **Authentication and verification** – Integrate with an OIDC provider (e.g. Auth0 or AWS Cognito) and add flows for account creation, two‑factor authentication, and encounter verification.
* **Objective data ingestion** – Build ETL jobs to import HCAHPS star ratings, readmission rates, QPP/MIPS scores and other measures into the database and display them on profile pages.
* **Provider claim & reply** – Implement a claim process for providers to manage their profiles, respond to reviews via HIPAA‑safe templates and access deeper insights behind a gating model.
* **Search and ranking** – Integrate an OpenSearch/Elasticsearch cluster to power full‑text search, facet filtering and ranking algorithms.
* **Moderation and trust & safety** – Add a moderation queue, automated checks for profanity and personal information, helpful voting on reviews and an appeals process.
* **Accessibility and internationalisation** – Ensure all pages meet WCAG 2.2 AA standards and add i18n support for multiple languages.
* **CI/CD and infrastructure** – Set up GitHub Actions workflows for linting, testing, building and deploying, and create Terraform modules for AWS infrastructure.

By expanding on this scaffold, you can build a comprehensive, privacy‑respecting review platform that benefits patients, providers and healthcare systems alike.

---

© 2025 Bedside Project Contributors