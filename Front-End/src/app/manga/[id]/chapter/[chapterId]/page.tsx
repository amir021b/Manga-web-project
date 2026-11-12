import Layout from '@/components/layout/Layout';
import ReaderPage from '@/pages/ReaderPage';

export default function Page({ params }: { params: { id: string; chapterId: string } }) {
  return (
    <Layout>
      <ReaderPage />
    </Layout>
  );
}
