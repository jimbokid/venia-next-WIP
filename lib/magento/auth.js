import { cookies } from 'next/headers';

const CUSTOMER_TOKEN_COOKIE_NAME =
    process.env.MAGENTO_CUSTOMER_TOKEN_COOKIE_NAME || 'customer_token';

export function getCustomerTokenFromCookies() {
    const cookieStore = cookies();
    return cookieStore.get(CUSTOMER_TOKEN_COOKIE_NAME)?.value || null;
}
