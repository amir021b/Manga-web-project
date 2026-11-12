import Layout from '@/components/layout/Layout';
import ReaderPage from '@/pages/ReaderPage';

export default async function Page({ params }: { params: Promise<{ id: string; chapterId: string }> }) {
  const { id, chapterId } = await params;
  return (
    <Layout>
      <ReaderPage id={id} chapterId={chapterId} />
    </Layout>
  );
}
