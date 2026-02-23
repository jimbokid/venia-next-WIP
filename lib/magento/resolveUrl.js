import { magentoRequest } from './client';

const RESOLVE_URL_QUERY = `
  query ResolveURL($url: String!) {
    route(url: $url) {
      relative_url
      redirect_code
      type
      ... on CmsPage {
        identifier
      }
      ... on CategoryInterface {
        uid
      }
      ... on ProductInterface {
        uid
      }
    }
  }
`;

function normalizePath(rawPath) {
    const [pathWithoutQuery] = (rawPath || '/').split('?');
    let normalized = pathWithoutQuery.trim();

    if (!normalized.startsWith('/')) {
        normalized = `/${normalized}`;
    }

    normalized = normalized.replace(/\/{2,}/g, '/');

    if (normalized.length > 1 && normalized.endsWith('/')) {
        normalized = normalized.slice(0, -1);
    }

    return normalized || '/';
}

export async function resolveMagentoRoute({ storeCode, path, customerToken }) {
    const normalizedPath = normalizePath(path);

    try {
        const data = await magentoRequest({
            query: RESOLVE_URL_QUERY,
            variables: { url: normalizedPath },
            storeCode,
            customerToken,
            cache: 'force-cache',
            next: { revalidate: 60 }
        });

        const route = data?.route;

        if (!route) {
            return { type: null };
        }

        if (route.redirect_code) {
            return {
                type: route.type || null,
                redirect: {
                    url: route.relative_url || normalizedPath,
                    code: route.redirect_code
                },
                identifier: route.identifier,
                uid: route.uid
            };
        }

        return {
            type: route.type || null,
            identifier: route.identifier,
            uid: route.uid,
            relativeUrl: route.relative_url
        };
    } catch (error) {
        throw new Error(
            `resolveMagentoRoute failed for "${normalizedPath}": ${
                error.message
            }`
        );
    }
}
