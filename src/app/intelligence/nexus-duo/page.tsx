import dynamic from 'next/dynamic';

const NexusDuoMode = dynamic(
  () => import('@/components/maga/nexus-duo-mode').then((mod) => mod.NexusDuoMode),
  { ssr: false }
);

export default function NexusDuoPage() {
  return (
    <main className="min-h-screen bg-black">
      <NexusDuoMode />
    </main>
  );
}
