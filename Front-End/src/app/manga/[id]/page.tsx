import Layout from '@/components/layout/Layout';
import MangaDetailPage from '@/pages/MangaDetailPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Layout>
      <MangaDetailPage id={id} />
    </Layout>
  );
}
