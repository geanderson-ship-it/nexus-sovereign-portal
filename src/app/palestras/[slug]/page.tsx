import { redirect } from 'next/navigation';
import { palestras } from '@/lib/courses-data';

export function generateStaticParams() {
  return palestras.map((p) => ({
    slug: p.slug,
  }));
}

export default function PalestraPage({ params }: { params: { slug: string } }) {
  // Redirect to the preview page for this lecture
  redirect(`/palestras/${params.slug}/preview`);
}
