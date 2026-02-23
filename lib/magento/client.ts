import { GraphQLClient } from 'graphql-request';

export type MagentoClientOptions = {
  storeCode: string;
  customerToken?: string;
};

function getMagentoBackendUrl(): string {
  const backendUrl = process.env.MAGENTO_BACKEND_URL;

  if (!backendUrl) {
    throw new Error('MAGENTO_BACKEND_URL is required');
  }

  if (!backendUrl.endsWith('/')) {
    throw new Error('MAGENTO_BACKEND_URL must end with /');
  }

  return backendUrl;
}

export function getMagentoGraphqlEndpoint(): string {
  return `${getMagentoBackendUrl()}graphql`;
}

export function createMagentoClient(opts: MagentoClientOptions): GraphQLClient {
  const headers: Record<string, string> = {
    Store: opts.storeCode,
    'Content-Type': 'application/json',
  };

  if (opts.customerToken) {
    headers.Authorization = `Bearer ${opts.customerToken}`;
  }

  return new GraphQLClient(getMagentoGraphqlEndpoint(), {
    headers,
  });
}
