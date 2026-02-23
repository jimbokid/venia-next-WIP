export const metadata = {
    title: 'Magento Storefront',
    description: 'Next.js SSR storefront for Magento'
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
