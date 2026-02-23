import { magentoRequest } from './client';

const CMS_PAGE_QUERY = `
  query CmsPage($identifier: String!) {
    cmsPage(identifier: $identifier) {
      identifier
      title
      content
      meta_title
      meta_description
    }
  }
`;

export async function getCmsPage({ identifier, storeCode, customerToken }) {
    const data = await magentoRequest({
        query: CMS_PAGE_QUERY,
        variables: { identifier },
        storeCode,
        customerToken,
        cache: 'force-cache',
        next: { revalidate: 60 }
    });

    return data?.cmsPage || null;
}
