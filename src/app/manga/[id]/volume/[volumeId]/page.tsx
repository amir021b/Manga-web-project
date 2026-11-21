import Layout from '@/components/layout/Layout';
import VolumePage from '@/views/VolumePage';
import { getAllManga, getVolumes } from '@/services/mangaApi';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllManga().flatMap((manga) =>
    getVolumes(manga.id).map((volume) => ({
      id: String(manga.id),
      volumeId: volume.volumeId,
    })),
  );
}

export default async function Page({ params }: { params: Promise<{ id: string; volumeId: string }> }) {
  const { id, volumeId } = await params;
  return (
    <Layout>
      <VolumePage id={id} volumeId={volumeId} />
    </Layout>
  );
}
