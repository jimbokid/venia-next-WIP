import { buildCanonicalUrl } from './canonical';

export function buildMetadata({ storeCode, relativeUrl, title, description }) {
    const canonical = buildCanonicalUrl({ storeCode, relativeUrl });

    return {
        title: title || undefined,
        description: description || undefined,
        alternates: {
            canonical
        }
    };
}
