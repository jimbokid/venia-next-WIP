function formatPrice(price) {
    if (!price) return '';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: price.currency
    }).format(price.value);
}

export default function ProductPage({ product, canonicalUrl }) {
    const minimumPrice = product.price_range?.minimum_price;
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        sku: product.sku,
        image: product.media_gallery?.map(image => image.url) || [],
        offers: {
            '@type': 'Offer',
            priceCurrency: minimumPrice?.final_price?.currency,
            price: minimumPrice?.final_price?.value,
            url: canonicalUrl,
            availability: 'https://schema.org/InStock'
        }
    };

    return (
        <article>
            <h1>{product.name}</h1>
            <p>SKU: {product.sku}</p>
            <p>
                {formatPrice(minimumPrice?.final_price)}
                {minimumPrice?.regular_price?.value !==
                minimumPrice?.final_price?.value ? (
                    <span>
                        {' '}
                        (Reg. {formatPrice(minimumPrice.regular_price)})
                    </span>
                ) : null}
            </p>
            <div
                dangerouslySetInnerHTML={{
                    __html: product.description?.html || ''
                }}
            />
            {product.media_gallery?.[0]?.url ? (
                <img src={product.media_gallery[0].url} alt={product.name} />
            ) : null}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        </article>
    );
}
