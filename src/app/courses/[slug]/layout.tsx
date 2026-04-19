import { allCourses } from '@/lib/courses-data';

export function generateStaticParams() {
    return allCourses.map((c) => ({
        slug: c.slug,
    }));
}

export default function CoursesSlugLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
