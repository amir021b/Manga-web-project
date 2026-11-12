import { Suspense } from 'react';
import Layout from '@/components/layout/Layout';
import SearchPage from '@/pages/SearchPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center px-4 bg-[var(--mh-bg)]">Loading...</div>}>
      <Layout>
        <SearchPage />
      </Layout>
    </Suspense>
  );
}
