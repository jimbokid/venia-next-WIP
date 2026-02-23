import { magentoRequest } from './client';

const CATEGORY_PAGE_QUERY = `
  query CategoryPage($uid: String!, $pageSize: Int!, $currentPage: Int!, $sort: ProductAttributeSortInput) {
    category(uid: $uid) {
      uid
      name
      description
      products(pageSize: $pageSize, currentPage: $currentPage, sort: $sort) {
        total_count
        page_info {
          current_page
          page_size
          total_pages
        }
        items {
          uid
          name
          sku
          url_key
          small_image {
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
  }
`;

function parseSort(sortParam) {
    if (!sortParam) {
        return null;
    }

    const [field, direction] = sortParam.split('_');
    const normalizedDirection =
        direction?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    if (!field) {
        return null;
    }

    return { [field]: normalizedDirection };
}

export async function getCategoryPage({
    uid,
    storeCode,
    customerToken,
    pageSize = 24,
    currentPage = 1,
    sort
}) {
    const data = await magentoRequest({
        query: CATEGORY_PAGE_QUERY,
        variables: {
            uid,
            pageSize,
            currentPage,
            sort: parseSort(sort)
        },
        storeCode,
        customerToken,
        cache: 'force-cache',
        next: { revalidate: 60 }
    });

    return data?.category || null;
}
