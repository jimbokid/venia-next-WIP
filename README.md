# Venia Next WIP (Ticket 0 baseline)

This repository is now bootstrapped as a Next.js (App Router + TypeScript) baseline with server-side Magento GraphQL connectivity and multi-store request context support.

## Prerequisites

- Node.js 18+
- Yarn v1+

## Setup

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Create `.env.local` (do not commit):

   ```bash
   MAGENTO_BACKEND_URL=https://<your-magento-domain>/
   # optional for future default store fallback
   # MAGENTO_DEFAULT_STORE=default
   ```

   Notes:
   - `MAGENTO_BACKEND_URL` **must end with** `/`.
   - Magento GraphQL endpoint is `${MAGENTO_BACKEND_URL}graphql`.

3. Download schema and generate typed documents:

   ```bash
   yarn schema:download
   yarn codegen
   ```

4. Start local dev server:

   ```bash
   yarn dev
   ```

## Health check

- Endpoint: `GET /api/health?store=default`
- Example local URL: <http://localhost:3000/api/health?store=default>

On success, the endpoint responds with:

```json
{
  "ok": true,
  "storeCode": "default",
  "backend": "https://.../graphql",
  "storeConfig": {
    "code": "default",
    "store_name": "Default Store View"
  }
}
```

On error, it responds with status `500` and:

```json
{
  "ok": false,
  "error": "..."
}
```
