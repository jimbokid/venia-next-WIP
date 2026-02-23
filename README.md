# Venia Next.js Magento baseline (Ticket 0)

This repository contains a JavaScript-first Next.js (App Router) baseline for server-side Magento GraphQL calls with multi-store support.

## Quickstart

1. Copy env template:

```bash
cp .env.example .env.local
```

2. Set your Magento backend URL in `.env.local`:

```bash
MAGENTO_BACKEND_URL=https://<your-magento-domain>/
MAGENTO_DEFAULT_STORE=default
```

> `MAGENTO_BACKEND_URL` **must** end with `/`.

3. Install dependencies:

```bash
yarn install
```

4. Start the dev server:

```bash
yarn dev
```

5. Open health endpoint:

```text
http://localhost:3000/api/health?store=default
```

## Included Magento helpers

- `lib/magento/context.js`: derives `storeCode` from URL pathname.
- `lib/magento/client.js`: GraphQL client factory with Magento multi-store headers.
- `lib/magento/queries.js`: `STORE_CONFIG_QUERY` baseline query.
- `app/api/health/route.js`: server route that validates GraphQL connectivity.
