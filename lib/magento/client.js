import { GraphQLClient } from 'graphql-request';

/**
 * @typedef {{
 *   storeCode: string,
 *   customerToken?: string
 * }} MagentoClientOptions
 */

export function getMagentoGraphqlEndpoint() {
  const backendUrl = process.env.MAGENTO_BACKEND_URL;

  if (!backendUrl) {
    throw new Error('MAGENTO_BACKEND_URL is required and must end with /.');
  }

  if (!backendUrl.endsWith('/')) {
    throw new Error('MAGENTO_BACKEND_URL must end with /.');
  }

  return `${backendUrl}graphql`;
}

/**
 * @param {MagentoClientOptions} opts
 */
export function createMagentoClient(opts) {
  if (!opts?.storeCode) {
    throw new Error('createMagentoClient requires a storeCode.');
  }

  const headers = {
    Store: opts.storeCode,
    'Content-Type': 'application/json'
  };

  if (opts.customerToken) {
    headers.Authorization = `Bearer ${opts.customerToken}`;
  }

  return new GraphQLClient(getMagentoGraphqlEndpoint(), { headers });
}
