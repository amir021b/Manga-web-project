import Layout from '@/components/layout/Layout';
import VolumePage from '@/views/VolumePage';

export default async function Page({ params }: { params: Promise<{ id: string; volumeId: string }> }) {
  const { id, volumeId } = await params;
  return (
    <Layout>
      <VolumePage id={id} volumeId={volumeId} />
    </Layout>
  );
}
