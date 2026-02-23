const MAGENTO_GRAPHQL_ENDPOINT = process.env.MAGENTO_GRAPHQL_ENDPOINT;

function assertEndpoint() {
    if (!MAGENTO_GRAPHQL_ENDPOINT) {
        throw new Error(
            'MAGENTO_GRAPHQL_ENDPOINT is required to query Magento GraphQL.'
        );
    }
}

export async function magentoRequest({
    query,
    variables = {},
    storeCode,
    customerToken,
    cache = 'force-cache',
    next
}) {
    assertEndpoint();

    const headers = {
        'Content-Type': 'application/json',
        Store: storeCode
    };

    if (customerToken) {
        headers.Authorization = `Bearer ${customerToken}`;
    }

    const response = await fetch(MAGENTO_GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
        cache: customerToken ? 'no-store' : cache,
        next: customerToken ? { revalidate: 0 } : next
    });

    if (!response.ok) {
        throw new Error(
            `Magento GraphQL request failed with status ${response.status}.`
        );
    }

    const payload = await response.json();

    if (payload.errors?.length) {
        const messages = payload.errors.map(error => error.message).join('; ');
        throw new Error(`Magento GraphQL error: ${messages}`);
    }

    return payload.data;
}
