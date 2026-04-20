import dynamic from 'next/dynamic';

const MagaLiveMode = dynamic(
  () => import('@/components/maga/maga-live-mode').then((mod) => mod.MagaLiveMode),
  { ssr: false }
);

export default function MagaLivePage() {
  return (
    <main className="min-h-screen bg-black">
      <MagaLiveMode />
    </main>
  );
}
