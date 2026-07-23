
'use client';

import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Type, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/use-locale';

export default function BrandAssetsPage() {
  const { t } = useLocale();

  const brandColors = [
    { name: t('brand.colors.background'), hex: '#0A0A0B', hsl: '240 10% 3.9%' },
    { name: t('brand.colors.foreground'), hex: '#FDFCFE', hsl: '0 0% 98%' },
    { name: t('brand.colors.primary'), hex: '#4B5CC4', hsl: '233 47% 49%' },
    { name: t('brand.colors.accent'), hex: '#C99A2E', hsl: '43 74% 49%' },
    { name: t('brand.colors.secondary'), hex: '#27272A', hsl: '240 3.7% 15.9%' },
    { name: t('brand.colors.muted'), hex: '#A1A1AA', hsl: '240 5% 64.9%' },
    { name: t('brand.colors.destructive'), hex: '#9B2C2C', hsl: '0 62.8% 30.6%' },
  ];

  const typography = [
    { name: t('brand.typography.headline.name'), family: t('brand.typography.headline.family'), variable: '--font-headline', usage: t('brand.typography.headline.usage') },
    { name: t('brand.typography.body.name'), family: t('brand.typography.body.family'), variable: '--font-sans', usage: t('brand.typography.body.usage') },
  ];

  const downloadLogo = () => {
    const svgElement = document.getElementById('logo-for-download');
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nexus-treinamento-logo.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="container mx-auto py-12 md:py-20">
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <div className="mb-12 text-center">
        <h1 className={cn("text-4xl font-bold tracking-tighter text-primary sm:text-5xl", "font-headline")}>
          {t('brand.title')}
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground font-sans">
          {t('brand.subtitle')}
        </p>
      </div>

      {/* Logo Section */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-2xl text-foreground">
            <Download className="h-6 w-6 text-primary" />
            {t('brand.logo.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <div className="flex-1 rounded-lg border-2 border-primary/20 bg-zinc-950/60 backdrop-blur-md p-8 shadow-xl shadow-black/40">
              <Logo className="mx-auto" />
            </div>
            <div className="flex-1">
              <p className="mb-4 text-muted-foreground">
                {t('brand.logo.text')}
              </p>
              <Button onClick={downloadLogo}>
                <Download className="mr-2 h-4 w-4" />
                {t('brand.logo.cta')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Palette Section */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-2xl text-foreground">
            <Palette className="h-6 w-6 text-primary" />
            {t('brand.colors.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {brandColors.map((color) => (
              <div key={color.name} className="flex flex-col items-center text-center">
                <div
                  className="h-24 w-24 rounded-lg border-2 border-border"
                  style={{ backgroundColor: color.hex }}
                />
                <h3 className="mt-2 font-semibold text-foreground">{color.name}</h3>
                <p className="text-sm text-muted-foreground">{color.hex}</p>
                <p className="text-xs text-muted-foreground">{color.hsl}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Typography Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-2xl text-foreground">
            <Type className="h-6 w-6 text-primary" />
            {t('brand.typography.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {typography.map((font) => (
              <div key={font.name}>
                <h3 className="text-xl font-semibold text-foreground">{font.name}</h3>
                <p className={cn('text-4xl', font.variable === '--font-headline' ? 'font-headline' : 'font-sans')}>
                  {font.family}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {font.usage}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Hidden SVG for download */}
      <div style={{ display: 'none' }}>
        <svg
            id="logo-for-download"
            viewBox="0 0 1700 260"
            xmlns="http://www.w3.org/2000/svg"
        >
            <style>
                {`
                .title-text { font-family: 'Poppins', sans-serif; }
                .slogan-text { font-family: 'PT Sans', sans-serif; fill: #C99A2E; }
                `}
            </style>
            <text
                className="title-text"
                x="50%" y="120" fontSize="140" fontWeight="bold" fill="#4B5CC4" letterSpacing="10" textAnchor="middle">
                NEXUS TREINAMENTO
            </text>
            <text
                className="slogan-text"
                x="50%" y="230" fontSize="100" fontStyle="italic" fontWeight="600" textAnchor="middle"
            >
                {t('footerSlogan')}
            </text>
        </svg>
      </div>
    </div>
  );
}
