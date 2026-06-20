'use client';
import { getCourseBySlug } from '@/lib/courses-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn, generatePixPayload } from '@/lib/utils';
import { CheckCircle, Clock, Users, BookOpen, Briefcase, Award, Zap, ShieldCheck, XCircle, Key, Lock, MessageSquare, Copy, Check, ScanLine, Shield, Star, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { useUser } from '@/auth';
import { useAccessLevel } from '@/hooks/use-access-level';
import RelacionamentoInicianteContent from '@/components/course-content/relacionamento-iniciante';
import RelacionamentoIntermediarioContent from '@/components/course-content/relacionamento-intermediario';
import PreparandoEquipesIntermediarioContent from '@/components/course-content/preparando-equipes-intermediario';
import LiderancaAvancadoContent from '@/components/course-content/lideranca-avancado';
import PalestraDetail from '@/components/course-content/palestra-detail';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import placeholderImages from '@/lib/placeholder-images.json';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocale } from '@/hooks/use-locale';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const QrCode = dynamic(() => import('@/components/ui/qr-code').then(mod => mod.QrCode), {
  ssr: false,
  loading: () => <Skeleton className="w-[64px] h-[64px] rounded-lg" />,
});


const courseContentComponents: Record<string, React.ComponentType<any>> = {
  'relacionamento-interpessoal-iniciante': RelacionamentoInicianteContent,
  'relacionamento-interpessoal-intermediario': RelacionamentoIntermediarioContent,
  'preparando-equipes-intermediario': PreparandoEquipesIntermediarioContent,
  'lideranca-avancado': LiderancaAvancadoContent,
  'comunicacao-que-conecta': (props) => <PalestraDetail {...props} />,
  'motivacao-e-engajamento': (props) => <PalestraDetail {...props} />,
  'inteligencia-emocional': (props) => <PalestraDetail {...props} />,
  'lideranca-humanizada': (props) => <PalestraDetail {...props} />,
  'seguranca-psicologica': (props) => <PalestraDetail {...props} />,
  'cultura-de-alta-performance': (props) => <PalestraDetail {...props} />,
  'gestao-de-conflitos': (props) => <PalestraDetail {...props} />,
};


interface Purchase {
  id: string;
  userId: string;
  courseId: string;
  purchaseDate: string;
  price: number;
}

const formatPrice = (price: number, locale: string = 'pt-BR') => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '';
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: locale === 'pt-BR' ? 'BRL' : 'USD',
  }).format(price);
};

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { t, tArray, locale } = useLocale();
  const course = getCourseBySlug(slug);
  const router = useRouter();
  const { toast } = useToast();
  const { hasSalesAccess, user } = useAccessLevel();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isPayloadCopied, setIsPayloadCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ minutes: 29, seconds: 59 });

  // Countdown timer para urgência
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes === 0 && prev.seconds === 0) {
            clearInterval(timer);
            return prev;
        }
        if (prev.seconds === 0) {
            return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { hasSalesAccess, hasAdminAccess } = useAccessLevel();
  const isPurchased = hasSalesAccess;
  const purchaseId = hasAdminAccess ? `admin-access-${course?.slug}` : null;
  const purchasesLoading = false;
  
    const pixPayload = useMemo(() => {
        if (!course || course.type === 'palestra') return '';
        return generatePixPayload({
            amount: course.discountedPrice,
            txid: '***',
        });
    }, [course]);

  if (!course) {
    notFound();
  }
  
  const isPalestra = course.type === 'palestra';

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(pixPayload);
    setIsPayloadCopied(true);
    toast({ title: t('courseDetail.toast.pixCopied') });
    setTimeout(() => setIsPayloadCopied(false), 2000);
  }

  const handlePurchase = async () => {
    if (!user) {
        toast({
            variant: 'destructive',
            title: t('courseDetail.toast.loginRequired.title'),
            description: t('courseDetail.toast.loginRequired.description'),
        });
        router.push('/login');
        return;
    }
    // TODO: implementar compra via Amplify/DynamoDB
    setIsSubmitting(false);
  };

  const ContentComponent = courseContentComponents[course.slug];
  
  const isLoading = isUserLoading || purchasesLoading;

  return (
    <div className="container mx-auto max-w-6xl py-12 md:py-20">
       {course && !isPalestra && (
         <Dialog open={showQrModal} onOpenChange={setShowQrModal}>
            <DialogContent className="bg-white p-4 max-w-xs">
                <DialogHeader>
                    <DialogTitle className="text-center text-black">{t('courseDetail.dialog.pix.title')}</DialogTitle>
                    <DialogDescription className="text-center">
                        {t('courseDetail.dialog.pix.description')}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center p-4">
                    <QrCode value={pixPayload} size={256} />
                </div>
                <p className="text-center text-black font-bold">{t('courseDetail.dialog.pix.value', { price: course.discountedPrice.toFixed(2).replace('.', ',') })}</p>
                <div className="mt-2 text-center">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                        Caixa Federal • Venâncio Aires/RS
                    </span>
                </div>
            </DialogContent>
        </Dialog>
      )}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {/* Coluna Principal */}
        <div className="md:col-span-2">
          <div className="mb-4">
            <Link href="/courses" className="text-sm text-primary hover:underline">
              &larr; {t('courseDetail.backLink')}
            </Link>
          </div>
          <h1 className={cn("text-4xl font-bold text-primary", "font-headline")}>
            {t(`courses.${course.slug}.title` as any)}
          </h1>
           {t(`courses.${course.slug}.subtitle` as any) && <p className="mt-4 text-xl font-semibold text-muted-foreground">{t(`courses.${course.slug}.subtitle` as any)}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {tArray(`courses.${course.slug}.tags` as any).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="relative my-8 h-96 w-full overflow-hidden rounded-lg">
            <Image
              src={course.image.src}
              alt={course.image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              data-ai-hint={course.image.hint}
            />
          </div>

          <div className="prose prose-invert max-w-none text-foreground">
              {ContentComponent ? (
                <ContentComponent course={course} isPurchased={isPurchased} />
              ) : (
                <>
                  <h2 className={cn("text-2xl font-bold text-primary", "font-headline")}>{t('courseDetail.learningTitle')}</h2>
                  <ul className="list-disc pl-5 mt-4 space-y-2">
                    <li>{t('courseDetail.learningItem1')}</li>
                    <li>{t('courseDetail.learningItem2')}</li>
                    <li>{t('courseDetail.learningItem3')}</li>
                    <li>{t('courseDetail.learningItem4')}</li>
                    <li>{t('courseDetail.learningItem5')}</li>
                  </ul>
                  <h2 className={cn("text-2xl font-bold text-primary", "font-headline")}>{t('courseDetail.targetAudienceTitle')}</h2>
                  <p>
                    {t('courseDetail.targetAudienceDescription')}
                  </p>
                </>
              )}
          </div>
        </div>

        {/* Barra Lateral */}
        <div className="md:col-span-1">
          <Card className="sticky top-28">
            <CardContent className="pt-6">
              {isPalestra ? (
                 <div className="flex flex-col gap-4">
                  <span className="text-3xl font-bold text-primary text-center">{t('courseDetail.palestra.priceOnRequest')}</span>
                  <Button size="lg" asChild className="w-full h-12 text-lg font-bold">
                    <Link href={`/contact?subject=${course.slug}`}>
                      <Briefcase className="mr-2 h-5 w-5" />
                      {t('courseDetail.palestra.cta')}
                    </Link>
                  </Button>
                </div>
              ) : isLoading ? (
                 <Button size="lg" className="w-full" disabled>
                    {t('courseDetail.loading')}
                 </Button>
              ) : isPurchased && purchaseId ? (
                 <div className="flex flex-col gap-2">
                    <Button size="lg" variant="secondary" className="w-full" disabled>
                        {t('courseDetail.enrolled')}
                    </Button>
                    <Button size="lg" asChild className="w-full">
                        <Link href={`/certificate/view?id=${purchaseId}`}>
                            <Award className="mr-2 h-5 w-5" />
                            {t('courseDetail.viewCertificate')}
                        </Link>
                    </Button>
                </div>
              ) : (
                // Nova Seção de Planos de Acesso
                <div className="space-y-6">
                    <h3 className={cn("text-2xl font-bold text-center", "font-headline")}>{t('courseDetail.yourAccessPlan')}</h3>
                    {/* Opção 1: Pagamento Fracionado */}
                    <Card className="bg-zinc-950/40 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">{t('courseDetail.standardPlan.title')}</CardTitle>
                            <CardDescription>{t('courseDetail.standardPlan.description')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                           <div className="flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{t('courseDetail.standardPlan.feature1')}</span>
                            </div>
                            <div className="flex items-start gap-2 text-muted-foreground line-through">
                                <Lock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                <span>{t('courseDetail.standardPlan.feature2')}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" disabled>{t('courseDetail.standardPlan.unavailable')}</Button>
                        </CardFooter>
                    </Card>

                    {/* Opção 2: Pagamento Integral */}
                    <div className="relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                            <Badge className="bg-primary text-primary-foreground font-bold">{t('courseDetail.goldPlan.badge')}</Badge>
                        </div>
                        <Card className="border-2 border-primary/50 shadow-lg shadow-primary/20 bg-zinc-950/60">
                             <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <ShieldCheck className="text-primary"/>
                                    {t('courseDetail.goldPlan.title')}
                                </CardTitle>
                                 <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-primary">
                                        {formatPrice(course.discountedPrice, locale)}
                                    </span>
                                 </div>
                                 <div className="bg-primary/10 rounded-md p-2 mt-2 border border-primary/20 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-primary font-mono text-xs">
                                        <Clock className="h-3 w-3 animate-pulse" />
                                        <span>{t('courseDetail.goldPlan.offerExpires')}</span>
                                    </div>
                                    <span className="font-mono font-bold text-primary">
                                        {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                                    </span>
                                 </div>
                                <CardDescription>{t('courseDetail.goldPlan.priceDescription')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                               <div className="flex items-start gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>{t('courseDetail.goldPlan.feature1')}</span>
                                </div>
                                <div className="flex items-start gap-2 font-bold text-primary">
                                    <div className="flex -space-x-2 mr-2 shrink-0 mt-0.5">
                                        <Avatar className="h-5 w-5 border border-primary">
                                            <AvatarImage src={placeholderImages.contact.src} alt="Djeny" />
                                            <AvatarFallback>DJ</AvatarFallback>
                                        </Avatar>
                                        <Avatar className="h-5 w-5 border border-gray-500">
                                            <AvatarImage src={placeholderImages.dante.src} alt="Dante" />
                                            <AvatarFallback>DA</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <span>{t('courseDetail.goldPlan.feature2')}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col gap-4">
                                 {!showPaymentPanel ? (
                                    <Button size="lg" className="w-full h-14 text-lg font-black bg-primary text-primary-foreground hover:bg-primary/90 btn-glow-pulse shimmer" onClick={() => setShowPaymentPanel(true)}>
                                        {t('courseDetail.goldPlan.unlockAccess')}
                                    </Button>
                                ) : (
                                    <div className="w-full space-y-3 text-left animate-in fade-in-0">
                                        <Button className="w-full h-12 font-bold" onClick={() => setShowQrModal(true)}>
                                            <ScanLine className="mr-2 h-5 w-5" />
                                            {t('courseDetail.payment.payWithQRCode')}
                                        </Button>
                                        <Button variant="secondary" className="w-full" onClick={handleCopyPayload}>
                                            {isPayloadCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                                            {isPayloadCopied ? t('courseDetail.payment.copied') : t('courseDetail.payment.copyPastePix')}
                                        </Button>
                                        <Button asChild className="w-full bg-green-600 hover:bg-green-700 h-11">
                                            <a href={`https://wa.me/5551999799582?text=${encodeURIComponent(t('courseDetail.payment.whatsappMessage', { price: formatPrice(course.discountedPrice, locale), courseTitle: course.title }))}`} target="_blank" rel="noopener noreferrer">
                                                <MessageSquare className="mr-2 h-4 w-4" />
                                                {t('courseDetail.payment.sendProof')}
                                            </a>
                                        </Button>
                                    </div>
                                 )}
                                <div className="mt-6 border-t border-white/5 pt-4 space-y-4">
                                    <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                        <Shield className="h-4 w-4 text-green-500" />
                                        <span>{t('courseDetail.guarantee')}</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-4 opacity-70 grayscale">
                                        <Image src="https://i.postimg.cc/85M02Gj9/pix-logo.png" alt="Pix" width={40} height={40} className="object-contain" />
                                        <Image src="https://i.postimg.cc/Y96vR6Z0/ssl-secure.png" alt="Secure" width={60} height={30} className="object-contain" />
                                    </div>
                                    <div className="bg-zinc-900/50 p-3 rounded-lg flex items-center gap-3">
                                        <div className="flex-shrink-0">
                                            <div className="flex -space-x-1">
                                                {[1,2,3].map(i => (
                                                    <Avatar key={i} className="h-6 w-6 border border-black">
                                                        <AvatarImage src={`https://i.pravatar.cc/100?u=${i+10}`} />
                                                    </Avatar>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-400 leading-tight">
                                            {t('courseDetail.socialProof', { count: 450 })}
                                        </p>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                    {hasAdminAccess && !isPurchased && (
                        <div className="mt-4 border-t pt-4">
                             <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10" onClick={handlePurchase} disabled={isSubmitting}>
                                <Key className="mr-2 h-4 w-4" />
                                {isSubmitting ? t('courseDetail.admin.grantingAccess') : t('courseDetail.admin.grantAccess')}
                            </Button>
                        </div>
                    )}
                 </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
