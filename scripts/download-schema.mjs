import { promises as fs } from 'node:fs';
import { getIntrospectionQuery, buildClientSchema, printSchema } from 'graphql';

const backendUrl = process.env.MAGENTO_BACKEND_URL;

if (!backendUrl) {
  throw new Error('MAGENTO_BACKEND_URL is required');
}

if (!backendUrl.endsWith('/')) {
  throw new Error('MAGENTO_BACKEND_URL must end with /');
}

const storeCode = process.env.MAGENTO_DEFAULT_STORE || 'default';
const endpoint = `${backendUrl}graphql`;

const response = await fetch(endpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Store: storeCode,
  },
  body: JSON.stringify({
    query: getIntrospectionQuery(),
  }),
});

if (!response.ok) {
  throw new Error(`Schema download failed (${response.status} ${response.statusText})`);
}

const payload = await response.json();

if (payload.errors) {
  throw new Error(`Schema introspection returned errors: ${JSON.stringify(payload.errors)}`);
}

const schema = buildClientSchema(payload.data);
const schemaSDL = printSchema(schema);

await fs.writeFile('graphql/schema.graphql', schemaSDL, 'utf8');
console.log(`Downloaded schema to graphql/schema.graphql using store \"${storeCode}\"`);
