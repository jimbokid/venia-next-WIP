export default function HomePage() {
  return (
    <main>
      <h1>Venia Next Baseline</h1>
      <p>
        Health check:{' '}
        <a href="/api/health?store=default">/api/health?store=default</a>
      </p>
    </main>
  );
}
