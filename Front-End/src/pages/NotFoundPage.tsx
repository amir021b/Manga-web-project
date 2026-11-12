"use client";

import { useRouter } from 'next/navigation';

function NotFoundPage() {
  const router = useRouter();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 bg-[var(--mh-bg)]">
      <div className="text-center">
        <h1 className="text-6xl font-black text-[var(--mh-text-muted)] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-[var(--mh-text)] mb-2">Page not found</h2>
        <p className="text-[var(--mh-text-secondary)] mb-8">The manga page you&#39;re looking for doesn&#39;t exist.</p>
        <button
          onClick={() => {
            router.push('/');
          }}
          className="h-12 rounded-[11px] bg-[#f2f2f2] text-black font-bold text-[15px] px-6 transition hover:bg-white"
        >
          Back to Home
        </button>
      </div>
    </section>
  );
}

export default NotFoundPage;
