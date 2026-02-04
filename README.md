<!-- Logo and Title -->
<div style="text-align: center;"> 
<img src="public/scale_logo.svg" alt="jurilib Logo" width="200"/>

</br>

<h1>JURILIB</h1>
</div>

Jurilib is a full‑stack legal services platform that connects users with organizations offering legal services. It supports managing cases and appointments through a modular web app and API surface.

The stack is [Next.js](https://nextjs.org/docs) + [TypeScript](https://www.typescriptlang.org/), with a [Prisma](https://www.prisma.io/docs) data layer. The UI uses [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/docs), with reusable components and API routes organized for feature growth and testing.

# Developer Documentation

## Prerequisites & Tools

- Node.js (version TODO)
- npm (bundled with Node.js)
- Docker Desktop or [Colima](https://github.com/abiosoft/colima) for the local Postgres container
- Recommended VS Code extensions:
  - [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Setup Guide (15‑minute quick start)

1. Start either [Docker Desktop](https://docs.docker.com/get-started/get-docker/) or [Colima](https://github.com/abiosoft/colima)
2. Install dependencies:
   - `npm install`
3. Create a `.env` file using `sample.env` as a template (copy and rename).
4. Start the database container:
   - `docker compose -f docker-compose.postgres.yml up -d`
5. Initialize and seed the database:
   - `npm run db:setup`
   - `npm run db:seed`
6. Start the dev server:
   - `npm run dev`

Open the app at [http://localhost:3000](http://localhost:3000). Prisma Studio will be available at [http://localhost:5555](http://localhost:5555).

## Folder / Code Structure

- `src/app/` — Next.js App Router pages and route handlers
  - `src/app/page.tsx` — landing page
  - `src/app/<page>/page.tsx` — feature pages (e.g., `dashboard`, `privacy`, `organization`)
  - `src/app/api/<endpoint>/` — API routes (e.g., `appointment`, `authentication`, `case`, `email`, `organization`, `search`, `user`)
- `src/components/` — reusable UI and feature components (e.g., `Authentication`, `LandingPage`, `Navbar`)
- `src/lib/` — shared helpers (`db.ts`, `utils.ts`, `withAuth.ts`, `brevo.ts`)
- `src/services/` — API client and server-side services
- `prisma/` — schema, migrations, and seeding
- `email_templates/` — Handlebars templates for transactional emails
- `generated/prisma/` — generated Prisma client (do not edit)
- `test/` — shared test utilities and mocks

## Environment Variables / Secrets

Configuration is loaded from `.env` (based on `sample.env`).

TODO: Document required variables and their purpose (e.g., database URL, email provider, authentication secrets).

## Development Process

TODO: Document branching strategy, PR workflow, and code review expectations.

## Test Suite

Tests are configured with Jest (see [jest.config.ts](jest.config.ts)).

- Run all tests: `npm test`
- Frontend tests only: `npm run test:frontend`
- Backend tests only: `npm run test:backend`

TODO: Summarize the main test categories and coverage expectations.

## API Documentation

API routes live under `src/app/api/` and include:

- `account`
- `appointment`
- `authentication`
- `case`
- `email`
- `employee`
- `organization`
- `search`
- `user`

TODO: Document endpoints, request/response shapes, auth requirements, and error handling.

## Deployment Guide

TODO: Document deployment steps, environments, and release process.

## Known Issues / Technical Debt

TODO: Track known limitations, missing features, and deferred refactors.

## Misc

### Daily Dev Loop

- Ensure the DB container is running.
- `npm run db:deploy`
- `npm run dev`

### Modifying the Database Schema

- Schema: `prisma/schema.prisma`
- Create a migration: `npm run db:dev`

### Frontend Icons

We use [Lucide](https://lucide.dev/icons/) for icons.

| name                | type    | default      |
| ------------------- | ------- | ------------ |
| size                | number  | 24           |
| color               | string  | currentColor |
| strokeWidth         | number  | 2            |
| absoluteStrokeWidth | boolean | false        |

**Usage:**

```tsx
const App = () => {
  return <Camera size={48} fill="red" />;
};
```
