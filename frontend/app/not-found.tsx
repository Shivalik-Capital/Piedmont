import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-9xl font-mono-data text-primary/20 mb-4 font-bold tracking-tighter">404</h1>
      <h2 className="text-3xl font-serif text-on-surface mb-4">Market Closed</h2>
      <p className="text-on-surface-variant max-w-md mb-8">
        We couldn't find the page you're looking for. The asset might have been delisted, or the URL is incorrect.
      </p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-primary text-surface font-bold rounded-lg hover:bg-primary/90 transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
