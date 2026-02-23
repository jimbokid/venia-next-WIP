/**
 * @typedef {{ storeCode: string }} StoreContext
 */

/**
 * Store code is the first URL segment: /{storeCode}/...
 * Examples:
 *  - "/default/venia-tops.html" -> "default"
 *  - "/de/" -> "de"
 * If no store segment ("/"), fallback to MAGENTO_DEFAULT_STORE or "default".
 *
 * @param {string} pathname
 * @returns {StoreContext}
 */
export function getStoreContextFromPathname(pathname) {
  const fallbackStore = process.env.MAGENTO_DEFAULT_STORE || 'default';
  const normalizedPath = String(pathname || '')
    .trim()
    .replace(/^\/+|\/+$/g, '');

  if (!normalizedPath) {
    return { storeCode: fallbackStore };
  }

  const [storeCode] = normalizedPath.split('/');
  return { storeCode: storeCode || fallbackStore };
}
