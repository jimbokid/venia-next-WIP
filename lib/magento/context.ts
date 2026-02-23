export type StoreContext = {
  storeCode: string;
};

const FALLBACK_STORE_CODE = process.env.MAGENTO_DEFAULT_STORE || 'default';

export function getStoreContextFromPathname(pathname: string): StoreContext {
  if (!pathname || pathname === '/') {
    return { storeCode: FALLBACK_STORE_CODE };
  }

  const [firstSegment] = pathname.split('/').filter(Boolean);

  return {
    storeCode: firstSegment || FALLBACK_STORE_CODE,
  };
}
