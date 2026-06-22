import { Metadata } from 'next';
import { getCourseBySlug } from '@/lib/courses-data';
import LiveLectureClientPage from './client-page';

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
    const course = getCourseBySlug(params.slug);
    
    if (!course || course.type !== 'palestra') {
        return {
            title: 'Palestra não encontrada | Nexus',
        };
    }

    return {
        title: `${course.title} (Ao Vivo) | Nexus Inteligência`,
        description: `Participe da palestra interativa ao vivo com ${course.speakers?.[0]?.name || 'nossos avatares'}`,
    };
}

export default function LiveLecturePage({ params }: { params: { slug: string } }) {
    const course = getCourseBySlug(params.slug);
    if (!course || course.type !== 'palestra') {
        return <div>Palestra não encontrada</div>;
    }
    
    return <LiveLectureClientPage course={course} slug={params.slug} />;
}
