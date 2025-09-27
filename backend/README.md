# E-commerce Backend (Node.js + Express + TypeScript + Prisma)

This is a TypeScript Express backend for an e-commerce API using Prisma (PostgreSQL) and JWT authentication. It follows a layered architecture with routes, controllers, services, middlewares, and utilities. Validation is handled by Zod. OpenAPI docs are served via Swagger UI.

## Prerequisites

- Node.js 18+
- PostgreSQL database (local or Docker)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env
# Edit .env to set DATABASE_URL, JWT_SECRET, PORT, and CORS_ORIGIN
```

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Create the initial database migration (requires a valid DATABASE_URL):

```bash
npm run prisma:migrate -- --name init
```

## Run

- Development server:

```bash
npm run dev
```

Server will start at: http://localhost:3000

## API Docs

- Swagger UI: http://localhost:3000/api/docs

The OpenAPI spec is located at `openapi/openapi.json`.

## Test

```bash
npm test
```

Note: Integration tests that hit the database will require a configured and migrated database.

## Project Structure

```
src/
  api/
    controllers/
    routes/
    services/
    validators/
  config/
  middlewares/
  types/
  utils/
openapi/
prisma/
tests/
```

## Core Scripts

- `npm run dev` – Start dev server with ts-node-dev
- `npm run build` – Compile TypeScript to `dist/`
- `npm start` – Run compiled server
- `npm test` – Run Jest + Supertest tests
- `npm run prisma:generate` – Generate Prisma client
- `npm run prisma:migrate` – Create/apply dev migration
- `npm run prisma:studio` – Open Prisma Studio
