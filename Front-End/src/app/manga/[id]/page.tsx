import Layout from '@/components/layout/Layout';
import MangaDetailPage from '@/pages/MangaDetailPage';

export default function Page({ params }: { params: { id: string } }) {
  return (
    <Layout>
      <MangaDetailPage />
    </Layout>
  );
}
