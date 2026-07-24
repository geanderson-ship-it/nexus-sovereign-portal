import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.nexustreinamento.com';

  // Static platform sections (excluding deleted courses, gallery, consulting, palestras)
  const staticRoutes = [
    '',
    '/exclusive',
    '/dante-safra',
    '/excellence',
    '/about',
    '/contact',
    '/intelligence/maga-live',
    '/intelligence/dante-safra',
    '/intelligence/djeny-design',
    '/psg-vision',
    '/proposito',
    '/vitrine-inovadora',
    '/energia',
    '/nexus-empresas',
    '/agro',
    '/nexus-rotas',
    '/inovamoda',
    '/inova-revenda',
    '/nexus-health',
    '/nexus-health/clinic',
    '/nexus-health/pharma',
    '/nexus-health/estima',
    '/nexus-empresas/construtech/orcamento',
    '/nexus-empresas/construtech/diario',
    '/nexus-empresas/construtech/equipamentos',
    '/nexus-empresas/construtech/seguranca',
    '/nexus-empresas/construtech/vistoria',
    '/nexus-empresas/martech/brand',
    '/nexus-empresas/martech/content',
    '/nexus-empresas/martech/ads',
    '/nexus-empresas/martech/crm',
    '/djeny-design',
    '/pactum-legal',
    '/pactum-link',
    '/nexus-empresas/rh',
    '/nexus-empresas/engenharia',
    '/nexus-empresas/estrategia',
    '/nexus-empresas/radio-studio',
    '/nexus-empresas/legaltech/compliance',
    '/nexus-empresas/legaltech/contratos',
    '/nexus-empresas/legaltech/jurimetria',
    '/nexus-empresas/legaltech/trabalhista',
    '/privacy',
    '/terms',
    '/suporte'
  ];

  const allRoutes = [...staticRoutes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' || route === '/exclusive' ? 1 : 0.8,
  }));
}
