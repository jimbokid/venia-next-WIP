import { magentoRequest } from './client';

const PRODUCT_PAGE_QUERY = `
  query ProductPage($uid: ID!) {
    products(filter: { uid: { eq: $uid } }) {
      items {
        uid
        name
        sku
        url_key
        description {
          html
        }
        media_gallery {
          url
        }
        price_range {
          minimum_price {
            regular_price {
              value
              currency
            }
            final_price {
              value
              currency
            }
          }
        }
      }
    }
  }
`;

export async function getProductByUid({ uid, storeCode, customerToken }) {
    const data = await magentoRequest({
        query: PRODUCT_PAGE_QUERY,
        variables: { uid },
        storeCode,
        customerToken,
        cache: 'force-cache',
        next: { revalidate: 60 }
    });

    return data?.products?.items?.[0] || null;
}
