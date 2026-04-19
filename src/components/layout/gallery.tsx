
'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { nexusCulture } from '@/lib/nexus-culture';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLocale } from '@/hooks/use-locale';

export function Gallery() {
  const { t, tObject } = useLocale();

  return (
    <section id="gallery" className="w-full bg-background py-20 md:py-24">
      <div className="container mx-auto max-w-7xl text-center">
        
        <h1 className={cn("text-4xl font-bold tracking-tighter sm:text-5xl", "font-headline")}>
            {t('gallery.title')}
        </h1>
        <h2 className="mx-auto mt-4 max-w-3xl text-xl font-semibold text-primary">
            {t('gallery.subtitle')}
        </h2>
        <p className="mx-auto mt-2 max-w-4xl text-lg text-muted-foreground font-sans">
          {t('gallery.text')}
        </p>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {(tObject<{ quote: string; nexusVision: string }[]>('gallery.culture') || []).map((item, index) => (
                <Card key={index} className="flex flex-col overflow-hidden transition-all duration-300 hover:scale-105 border-2 border-primary/30">
                    <div className="relative h-64 w-full">
                        <Image
                            src={nexusCulture[index]?.image.src || ''}
                            alt={nexusCulture[index]?.image.alt || ''}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            style={{ objectFit: 'cover' }}
                            data-ai-hint={nexusCulture[index]?.image.hint}
                        />
                    </div>
                     <CardHeader className="bg-transparent text-center">
                        <CardTitle className="font-headline text-lg text-primary">
                            "{item.quote}"
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 bg-transparent mt-2">
                        <p className="text-sm text-muted-foreground text-left whitespace-pre-line leading-relaxed">{item.nexusVision}</p>
                    </CardContent>
                </Card>
            ))}
        </div>

        <div className="mt-20 rounded-lg border-2 border-primary/20 bg-zinc-950/60 backdrop-blur-md p-8 text-center shadow-xl shadow-black/40">
          <h2 className={cn('text-3xl font-bold tracking-tight text-primary', 'font-headline')}>
            {t('gallery.cta.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t('gallery.cta.text')}
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/contact?subject=cultura-equipe">
                {t('gallery.cta.button')}
              </Link>
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}
