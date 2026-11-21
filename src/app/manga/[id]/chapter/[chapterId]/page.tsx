import Layout from '@/components/layout/Layout';
import ReaderPage from '@/views/ReaderPage';
import { getAllManga, getVolumes } from '@/services/mangaApi';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllManga().flatMap((manga) =>
    getVolumes(manga.id).flatMap((volume) =>
      volume.chapters.map((chapter) => ({
        id: String(manga.id),
        chapterId: String(chapter.chapterId),
      })),
    ),
  );
}

export default async function Page({ params }: { params: Promise<{ id: string; chapterId: string }> }) {
  const { id, chapterId } = await params;
  return (
    <Layout>
      <ReaderPage id={id} chapterId={chapterId} />
    </Layout>
  );
}
