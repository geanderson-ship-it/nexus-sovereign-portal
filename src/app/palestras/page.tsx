
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import Link from 'next/link';
import React, { useMemo } from 'react';
import Image from 'next/image';
import { useLocale } from '@/hooks/use-locale';
import { palestras } from '@/lib/courses-data';
import { cn } from '@/lib/utils';
import { useUser, useMemoAuth } from '@/auth';

import { Skeleton } from '@/components/ui/skeleton';
import { Lock, Sparkles } from 'lucide-react';
import { isAdminUser } from '@/lib/constants';

const WHATSAPP_NUMBER = '5551999799582';

export default function PalestrasPage() {
  const { t, tArray } = useLocale();
  const { user, isUserLoading } = useUser();

  const isAdmin = useMemo(() => isAdminUser(user), [user]);
  const purchasesLoading = false;
  const isLoading = isUserLoading;

  const getIsPurchased = (slug: string) => isAdmin;

  const generateWhatsAppLink = (palestraTitle: string) => {
    const message = t('lectures.whatsapp.message', { title: palestraTitle });
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="mb-12 text-center">
        <h1
          className={
            'text-4xl font-bold tracking-tighter text-primary sm:text-5xl font-headline'
          }
        >
          {t('lectures.title')}
        </h1>
      </div>

      <div className="relative h-96 w-full max-w-5xl mx-auto my-12 rounded-lg overflow-hidden shadow-2xl">
        <Image
          src="https://i.postimg.cc/P5Rz3JJk/Palestra-futurista.png"
          alt={t('lectures.hero.alt')}
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          style={{ objectFit: 'cover' }}
          data-ai-hint="futuristic presentation"
        />
      </div>

      <section className="max-w-4xl mx-auto my-16 text-lg text-center space-y-8 text-muted-foreground">
        <p className="text-xl text-foreground">{t('lectures.intro.p1')}</p>
        <p>{t('lectures.intro.p2')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left border border-white/10 p-6 rounded-lg">
          <div className="space-y-2">
            <h3 className="font-bold text-primary font-headline">{t('lectures.intro.dante.title')}</h3>
            <p className="text-sm">{t('lectures.intro.dante.description')}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-purple-400 font-headline">{t('lectures.intro.djeny.title')}</h3>
            <p className="text-sm">{t('lectures.intro.djeny.description')}</p>
          </div>
        </div>
        <div className="border-t border-b border-dashed border-primary/20 py-8">
          <h3 className="text-xl font-bold text-foreground font-headline mb-4">{t('lectures.intro.fromAuditorium.title')}</h3>
          <p>{t('lectures.intro.fromAuditorium.p1')}</p>
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-lg">{t('lectures.intro.conclusion.p1')}</p>
          <p className="text-2xl font-bold text-primary font-headline">{t('lectures.intro.conclusion.p2')}</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto mb-16 px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/30 via-purple-500/30 to-primary/30 p-[1px] shadow-2xl shadow-primary/20">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
          <div className="relative flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
             <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
             <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]" />
             
             <Sparkles className="h-10 w-10 text-primary animate-pulse mb-2" />
             <h2 className="text-3xl md:text-5xl font-bold tracking-[0.2em] font-headline text-white uppercase italic drop-shadow-lg">
                {t('lectures.comingSoon.title')}
             </h2>
             <p className="text-gray-400 text-sm md:text-base max-w-2xl font-light leading-relaxed">
                {t('lectures.comingSoon.description')}
             </p>
             <div className="h-1 w-32 bg-gradient-to-r from-transparent via-primary/50 to-transparent mt-4" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {palestras.map((palestra, index) => {
          const title = t(`palestras.${palestra.slug}.title` as any);
          return (
          <Card
            key={index}
            className="flex flex-col overflow-hidden bg-transparent"
          >
            <div className="relative h-48 w-full">
                <Image
                src={palestra.image.src}
                alt={palestra.image.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
                data-ai-hint={palestra.image.hint}
                quality={100}
                />
            </div>
            <CardHeader className="pt-4 pb-2">
              <CardTitle className={cn(
                "text-center font-headline font-bold text-foreground",
                title.length > 50 ? "text-base" : "text-xl"
              )}>
                {title}
              </CardTitle>
              <CardDescription className="text-center text-sm font-semibold text-primary">
                {t(`palestras.${palestra.slug}.category` as any)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4 text-center">
              <p className="italic text-muted-foreground text-sm">"{t(`palestras.${palestra.slug}.shortDescription` as any)}"</p>
              <div className="flex flex-wrap justify-center gap-2">
                {tArray(`palestras.${palestra.slug}.tags` as any).map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/10 border border-primary/30 px-3 py-1 text-xs text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 p-6 pt-0">
              <p className="text-sm font-semibold text-muted-foreground">
                {t('lectures.card.price')}
              </p>
              <Button asChild className="w-full">
                <Link
                  href={generateWhatsAppLink(title)}
                  target="_blank"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  {t('lectures.card.cta')}
                </Link>
              </Button>
              <Button asChild variant="secondary" className="w-full" disabled={!getIsPurchased(palestra.slug)}>
                  {getIsPurchased(palestra.slug) ? (
                    <Link href={`/palestras/${palestra.slug}/preview`}>{t('lectures.card.listenPreview')}</Link>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      {t('lectures.card.previewLocked')}
                    </span>
                  )}
              </Button>
            </CardFooter>
          </Card>
        )})}
      </div>
    </div>
  );
}
