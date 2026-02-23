import Link from 'next/link';

function formatPrice(price) {
    if (!price) return '';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: price.currency
    }).format(price.value);
}

export default function CategoryPage({
    storeCode,
    slugPath,
    category,
    currentPage,
    sort
}) {
    const products = category.products?.items || [];
    const pageInfo = category.products?.page_info;

    return (
        <section>
            <h1>{category.name}</h1>
            {category.description ? (
                <div
                    dangerouslySetInnerHTML={{ __html: category.description }}
                />
            ) : null}
            <ul>
                {products.map(product => {
                    const minimumPrice = product.price_range?.minimum_price;
                    return (
                        <li key={product.uid}>
                            <h2>{product.name}</h2>
                            {product.small_image?.url ? (
                                <img
                                    src={product.small_image.url}
                                    alt={product.name}
                                />
                            ) : null}
                            <p>SKU: {product.sku}</p>
                            <p>
                                {formatPrice(minimumPrice?.final_price)}
                                {minimumPrice?.regular_price?.value !==
                                minimumPrice?.final_price?.value ? (
                                    <span>
                                        {' '}
                                        (Reg.{' '}
                                        {formatPrice(
                                            minimumPrice.regular_price
                                        )}
                                        )
                                    </span>
                                ) : null}
                            </p>
                        </li>
                    );
                })}
            </ul>
            <nav>
                {pageInfo?.current_page > 1 ? (
                    <Link
                        href={{
                            pathname: `/${storeCode}/${slugPath}`,
                            query: {
                                page: pageInfo.current_page - 1,
                                ...(sort ? { sort } : {})
                            }
                        }}
                    >
                        Previous
                    </Link>
                ) : null}
                {pageInfo?.current_page < pageInfo?.total_pages ? (
                    <Link
                        href={{
                            pathname: `/${storeCode}/${slugPath}`,
                            query: {
                                page: pageInfo.current_page + 1,
                                ...(sort ? { sort } : {})
                            }
                        }}
                    >
                        Next
                    </Link>
                ) : null}
            </nav>
            <p>
                Page {currentPage}
                {pageInfo?.total_pages ? ` of ${pageInfo.total_pages}` : ''}
            </p>
        </section>
    );
}
