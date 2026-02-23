import { notFound, permanentRedirect, redirect } from 'next/navigation';
import CmsRenderer from '../../../components/cms/CmsRenderer';
import CategoryPage from '../../../components/plp/CategoryPage';
import ProductPage from '../../../components/pdp/ProductPage';
import { getCategoryPage } from '../../../lib/magento/category';
import { getMagentoRequestContext } from '../../../lib/magento/context';
import { getCmsPage } from '../../../lib/magento/cms';
import { getProductByUid } from '../../../lib/magento/product';
import { resolveMagentoRoute } from '../../../lib/magento/resolveUrl';
import { buildCanonicalUrl } from '../../../lib/seo/canonical';
import { buildMetadata } from '../../../lib/seo/metadata';

export const dynamic = 'force-dynamic';

function getRequestPath(slug) {
  if (!slug?.length) {
    return '/';
  }

  return `/${slug.join('/')}`;
}

function toInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function toStoreRelativeUrl(url, storeCode) {
  if (!url) {
    return `/${storeCode}`;
  }

  const normalized = url.startsWith('/') ? url : `/${url}`;
  return `/${storeCode}${normalized === '/' ? '' : normalized}`;
}

async function loadRouteData({ storeCode, slug, searchParams }) {
  const path = getRequestPath(slug);
  const { customerToken } = getMagentoRequestContext({ storeCode });
  const route = await resolveMagentoRoute({
    storeCode,
    path,
    customerToken,
  });

  if (route.redirect) {
    const destination = toStoreRelativeUrl(route.redirect.url, storeCode);
    return { route, redirect: { destination, code: route.redirect.code } };
  }

  if (route.type === 'CMS_PAGE' && route.identifier) {
    const cmsPage = await getCmsPage({
      identifier: route.identifier,
      storeCode,
      customerToken,
    });

    return {
      route,
      entity: cmsPage,
      canonicalRelativeUrl: route.relativeUrl || path,
    };
  }

  if (route.type === 'CATEGORY' && route.uid) {
    const currentPage = toInt(searchParams?.page, 1);
    const sort = searchParams?.sort;

    const category = await getCategoryPage({
      uid: route.uid,
      storeCode,
      customerToken,
      currentPage,
      sort,
    });

    return {
      route,
      entity: category,
      currentPage,
      sort,
      canonicalRelativeUrl: route.relativeUrl || path,
    };
  }

  if (route.type === 'PRODUCT' && route.uid) {
    const product = await getProductByUid({
      uid: route.uid,
      storeCode,
      customerToken,
    });

    return {
      route,
      entity: product,
      canonicalRelativeUrl: route.relativeUrl || path,
    };
  }

  return { route, entity: null };
}

export async function generateMetadata({ params, searchParams }) {
  const { store: storeCode, slug } = params;
  const routeData = await loadRouteData({ storeCode, slug, searchParams });

  if (routeData.redirect || !routeData.entity) {
    return {};
  }

  if (routeData.route.type === 'CMS_PAGE') {
    return buildMetadata({
      storeCode,
      relativeUrl: routeData.canonicalRelativeUrl,
      title: routeData.entity.meta_title || routeData.entity.title,
      description: routeData.entity.meta_description,
    });
  }

  if (routeData.route.type === 'CATEGORY') {
    return buildMetadata({
      storeCode,
      relativeUrl: routeData.canonicalRelativeUrl,
      title: routeData.entity.name,
    });
  }

  if (routeData.route.type === 'PRODUCT') {
    return buildMetadata({
      storeCode,
      relativeUrl: routeData.canonicalRelativeUrl,
      title: routeData.entity.name,
    });
  }

  return {};
}

export default async function StorefrontRoutePage({ params, searchParams }) {
  const { store: storeCode, slug } = params;
  const routeData = await loadRouteData({ storeCode, slug, searchParams });

  if (routeData.redirect) {
    if (routeData.redirect.code === 301) {
      permanentRedirect(routeData.redirect.destination);
    }

    redirect(routeData.redirect.destination);
  }

  if (!routeData.entity) {
    notFound();
  }

  if (routeData.route.type === 'CMS_PAGE') {
    return <CmsRenderer page={routeData.entity} />;
  }

  if (routeData.route.type === 'CATEGORY') {
    return (
      <CategoryPage
        storeCode={storeCode}
        slugPath={(slug || []).join('/')}
        category={routeData.entity}
        currentPage={routeData.currentPage}
        sort={routeData.sort}
      />
    );
  }

  if (routeData.route.type === 'PRODUCT') {
    const canonicalUrl = buildCanonicalUrl({
      storeCode,
      relativeUrl: routeData.canonicalRelativeUrl,
    });

    return <ProductPage product={routeData.entity} canonicalUrl={canonicalUrl} />;
  }

  notFound();
}
