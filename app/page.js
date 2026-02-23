export default function HomePage() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Venia Next.js Magento baseline</h1>
      <p>
        Health endpoint:{' '}
        <a href="/api/health?store=default">/api/health?store=default</a>
      </p>
    </main>
  );
}
