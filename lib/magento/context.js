import { getCustomerTokenFromCookies } from './auth';

export function getMagentoRequestContext({ storeCode }) {
    return {
        storeCode,
        customerToken: getCustomerTokenFromCookies()
    };
}
