import { palestras } from '@/lib/courses-data';

export function generateStaticParams() {
    return palestras.map((p) => ({
        slug: p.slug,
    }));
}

export default function PalestrasSlugLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
