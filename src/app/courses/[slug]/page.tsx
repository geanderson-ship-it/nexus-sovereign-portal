import { Metadata } from 'next';
import { allCourses, getCourseBySlug } from '@/lib/courses-data';
import ClientPage from './client-page';

export function generateStaticParams() {
    return allCourses.map((c) => ({
        slug: c.slug,
    }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
    const course = getCourseBySlug(params.slug);
    
    if (!course) {
        return {
            title: 'Curso não encontrado | Nexus',
        };
    }

    return {
        title: `${course.title} | Nexus Inteligência`,
        description: course.description,
        openGraph: {
            title: course.title,
            description: course.description,
            images: [course.image.src],
        },
    };
}

export default function Page({ params }: { params: { slug: string } }) {
    return <ClientPage params={params} />;
}
