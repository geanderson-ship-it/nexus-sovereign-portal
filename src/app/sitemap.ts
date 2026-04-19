import { MetadataRoute } from 'next';
import { allCourses, palestras } from '@/lib/courses-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nexus-site-novo.vercel.app';

  // Static platform sections
  const staticRoutes = [
    '',
    '/courses',
    '/dante-safra',
    '/gabinete',
    '/intelligence',
    '/excellence',
    '/about',
    '/contact',
    '/intelligence/maga-os',
    '/intelligence/dante-safra',
    '/intelligence/djeny-design',
    '/mentorship',
    '/gallery',
    '/psg-vision',
  ];

  const courseRoutes = allCourses.map(course => `/courses/${course.slug}`);
  const lectureRoutes = palestras.map(palestra => `/palestras/${palestra.slug}/preview`);

  const allRoutes = [...staticRoutes, ...courseRoutes, ...lectureRoutes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
}
