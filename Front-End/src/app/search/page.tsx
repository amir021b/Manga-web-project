import Layout from '@/components/layout/Layout';
import SearchPage from '@/pages/SearchPage';

export default function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  return (
    <Layout>
      <SearchPage />
    </Layout>
  );
}
