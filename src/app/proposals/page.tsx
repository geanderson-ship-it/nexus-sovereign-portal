
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DollarSign, Clock, Calendar, BarChart, Heart } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default function ProposalsPage() {
  const { t } = useLocale();

  const proposalData = {
    hourlyRate: 350,
    services: [
      {
        title: t('proposals.service1.title'),
        price: 3500,
        hours: 10,
        description: t('proposals.service1.description'),
      },
      {
        title: t('proposals.service2.title'),
        price: 1400,
        hours: 4,
        description: t('proposals.service2.description'),
      },
      {
        title: t('proposals.service3.title'),
        price: 5600,
        hours: 16,
        description: t('proposals.service3.description'),
      },
    ],
  };

  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="mb-12 text-center">
        <h1 className={cn("text-4xl font-bold tracking-tighter text-primary sm:text-5xl", "font-headline")}>
          {t('proposals.title')}
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground font-sans">
          {t('proposals.subtitle')}
        </p>
      </div>

      <Card className="mb-12 w-full max-w-md mx-auto bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-primary font-headline">
            <DollarSign className="h-8 w-8" />
            <span>{t('proposals.base.title')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-5xl font-bold text-foreground">
            {formatCurrency(proposalData.hourlyRate)}
          </p>
          <p className="text-muted-foreground">{t('proposals.base.value')}</p>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
        {proposalData.services.map((service) => (
          <Card key={service.title} className="flex flex-col">
            <CardHeader>
                <CardTitle className={cn("font-headline text-2xl", "text-foreground")}>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
               <div className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{t('proposals.price')}</span>
                    <span className="text-foreground font-bold">{formatCurrency(service.price)}</span>
                </div>
                <div className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{t('proposals.hours')}</span>
                     <span className="text-foreground font-bold">{service.hours} {t('proposals.hours.unit')}</span>
                </div>
                 {service.title.includes('Mensalidade') && (
                    <div className="flex items-center gap-2 text-lg">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span className="font-semibold">{t('proposals.frequency')}</span>
                        <span className="text-foreground font-bold">{t('proposals.frequency.value')}</span>
                    </div>
                 )}
            </CardContent>
          </Card>
        ))}
      </div>
       <div className="mt-16 text-center text-muted-foreground font-sans">
            <p><strong>{t('proposals.note.p1')}</strong></p>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-destructive/70">
                <Heart className="h-4 w-4" />
                <p>{t('proposals.note.p2')}</p>
            </div>
        </div>
    </div>
  );
}
