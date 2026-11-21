import Layout from '@/components/layout/Layout';
import MangaDetailPage from '@/views/MangaDetailPage';
import { getAllManga } from '@/services/mangaApi';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllManga().map((manga) => ({ id: String(manga.id) }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Layout>
      <MangaDetailPage id={id} />
    </Layout>
  );
}
