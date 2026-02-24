import './globals.css';

export const metadata = {
  title: 'Venia Next Storefront',
  description: 'JS-only Next.js App Router migration scaffold'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
