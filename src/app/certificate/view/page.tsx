'use client';

import { useUser, useMemoAuth } from '@/auth';

import { allCourses } from '@/lib/courses-data';
import { Logo } from '@/components/logo';
import { useSearchParams } from 'next/navigation';
import { useMemo, Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Award, ArrowLeft, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { isAdminUser } from '@/lib/constants';

interface Purchase {
  id: string;
  userId: string;
  courseId: string;
  purchaseDate: string;
  price: number;
}

const CertificateSkeleton = () => (
  <div className="bg-secondary/20 py-12 md:py-20 px-4">
    <div className="container mx-auto max-w-5xl">
       <div className="mb-4">
            <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 text-primary opacity-50">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para a Área do Aluno
            </div>
      </div>
      <div className="container mx-auto max-w-5xl rounded-2xl border-[6px] border-primary bg-background p-8 md:p-12 shadow-2xl text-center relative overflow-hidden select-none">
        <div className="relative z-10 flex flex-col items-center">
          <Skeleton className="h-24 w-1/2 mb-6" />
          <Skeleton className="h-10 w-1/3 mb-6" />
          <Skeleton className="h-8 w-1/4 mb-4" />
          <Skeleton className="h-16 w-3/4 mb-6" />
          <Skeleton className="h-12 w-2/3 mb-8" />
          <Skeleton className="h-16 w-3/4 mb-12" />
          <Skeleton className="h-20 w-80 mb-16" />
          <div className="flex justify-around items-center gap-12 w-full max-w-4xl mt-8">
            <Skeleton className="h-16 w-72" />
            <Skeleton className="h-16 w-72" />
          </div>
          <Skeleton className="h-6 w-1/3 mt-12" />
        </div>
      </div>
    </div>
  </div>
);

const NotFoundState = () => (
    <div className="container mx-auto py-12 md:py-20 text-center">
        <ShieldAlert className="mx-auto h-24 w-24 text-destructive" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-destructive">Certificado não encontrado.</h1>
        <p className="mt-2 text-lg text-muted-foreground">
            Não foi possível localizar o seu certificado. Verifique se você está logado na conta correta ou se o link está certo.
        </p>
        <div className="mt-8">
            <Button asChild>
                <Link href="/profile">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para a Área do Aluno
                </Link>
            </Button>
        </div>
    </div>
)


function CertificateContent() {
  const { user, isUserLoading } = useUser();
  const searchParams = useSearchParams();
  const purchaseId = searchParams?.get('id') as string | undefined;

  const isAdmin = useMemo(() => isAdminUser(user), [user]);
  const isAdminPreview = isAdmin && purchaseId?.startsWith('admin-access-');
  const courseSlugFromAdmin = isAdminPreview ? purchaseId!.replace('admin-access-', '') : null;

  const mockPurchase = useMemo<Purchase | null>(() => {
      if (!isAdminPreview) return null;
      return {
          id: purchaseId!,
          userId: user?.uid || '',
          courseId: courseSlugFromAdmin || '',
          purchaseDate: new Date().toISOString(),
          price: 0
      };
  }, [isAdminPreview, purchaseId, user?.uid, courseSlugFromAdmin]);

  const purchase = mockPurchase;
  const purchaseLoading = false;

  const course = useMemo(() => {
    if (!purchase) return null;
    return allCourses.find(c => c.slug === purchase.courseId);
  }, [purchase]);

  const isLoading = isUserLoading || purchaseLoading;

  if (isLoading) {
    return <CertificateSkeleton />;
  }

  if (!purchase || !course || !user) {
    return <NotFoundState />;
  }
  
  const completionDate = format(new Date(purchase.purchaseDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="bg-secondary/20 py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-5xl">
            <div className="mb-4">
                <Button asChild variant="ghost" className="text-primary hover:text-primary/80">
                    <Link href="/profile">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para a Área do Aluno
                    </Link>
                </Button>
            </div>
            <div className="rounded-2xl border-[6px] border-primary bg-background p-8 md:p-12 shadow-2xl text-center relative overflow-hidden select-none">
                
                <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                    <Image
                        src="/Certificado/Certificado..png"
                        alt="Fundo do Certificado Nexus"
                        fill
                        className="object-cover opacity-100"
                        data-ai-hint="nexus certificate background"
                    />
                </div>
                
                <div className="relative z-10 flex flex-col items-center pt-32 md:pt-48">
                    <h1 className={cn("text-3xl md:text-4xl font-bold tracking-tight uppercase text-amber-400 mb-8 drop-shadow-lg", "font-headline")}>
                        Certificado de Conclusão
                    </h1>

                    <p className="text-xl md:text-2xl text-white/90 mb-6 font-light">
                        A Nexus tem o orgulho de certificar que
                    </p>

                    <p className="text-4xl md:text-6xl font-extrabold text-amber-300 font-headline tracking-wider mb-8 leading-tight drop-shadow-lg">
                        {user.displayName}
                    </p>

                    <p className="max-w-4xl text-lg md:text-xl text-white/85 mb-8 font-light leading-relaxed">
                        concluiu com êxito o curso <strong className="text-amber-400 font-semibold">{course.title}</strong>
                    </p>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-4xl mb-12 border border-amber-400/30">
                        <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                            sob os pilares da Nexus: <strong className="text-amber-400 font-semibold">Humanidade, Respeito, Ética e Confiança</strong>
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-3 rounded-full border-2 border-amber-400/50 p-6 mb-16 w-96 bg-white/5 backdrop-blur-sm">
                        <Award className="w-10 h-10 text-amber-400" />
                        <p className="font-semibold text-amber-300 text-center text-lg">NEXUS TREINAMENTO</p>
                        <p className="text-sm font-bold tracking-wider text-white/70">Certificado de Excelência</p>
                    </div>

                    <p className="text-base text-white/80 mt-8 font-light">Data de Conclusão: {completionDate}</p>

                </div>
            </div>
        </div>
    </div>
  );
}

export default function CertificatePage() {
  return (
    <Suspense fallback={<CertificateSkeleton />}>
      <CertificateContent />
    </Suspense>
  );
}
