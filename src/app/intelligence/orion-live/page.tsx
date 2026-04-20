import dynamic from 'next/dynamic';

const OrionLiveMode = dynamic(
  () => import('@/components/maga/orion-live-mode').then((mod) => mod.OrionLiveMode),
  { ssr: false }
);

export default function OrionLivePage() {
  return (
    <main className="min-h-screen bg-black">
      <OrionLiveMode />
    </main>
  );
}
