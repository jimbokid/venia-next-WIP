const SITE_URL = process.env.SITE_URL || 'https://domain';

export function buildCanonicalUrl({ storeCode, relativeUrl = '/' }) {
    const normalizedPath = relativeUrl.startsWith('/')
        ? relativeUrl
        : `/${relativeUrl}`;
    return `${SITE_URL}/${storeCode}${
        normalizedPath === '/' ? '' : normalizedPath
    }`;
}
