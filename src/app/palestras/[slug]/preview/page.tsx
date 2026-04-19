import { Metadata } from 'next';
import { palestras as allPalestras, getCourseBySlug } from '@/lib/courses-data';
import ClientPage from './client-page';

export function generateStaticParams() {
    return allPalestras.map((palestra) => ({
      slug: palestra.slug,
    }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
    const palestra = getCourseBySlug(params.slug);
    
    if (!palestra) {
        return {
            title: 'Palestra não encontrada | Nexus',
        };
    }

    return {
        title: `${palestra.title} | Nexus Palestras`,
        description: palestra.description,
        openGraph: {
            title: palestra.title,
            description: palestra.description,
            images: [palestra.image.src],
        },
    };
}

export const dynamicParams = false;

export default function Page({ params }: { params: { slug: string } }) {
    return <ClientPage params={params} />;
}
