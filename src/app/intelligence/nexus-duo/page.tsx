import dynamic from 'next/dynamic';

const NexusDuoLive = dynamic(
  () => import('@/components/maga/nexus-duo-live').then((mod) => mod.NexusDuoLive),
  { ssr: false }
);

export default function NexusDuoPage() {
  return (
    <main className="min-h-screen bg-black">
      <NexusDuoLive />
    </main>
  );
}
