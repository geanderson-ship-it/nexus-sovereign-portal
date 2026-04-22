'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { allCourses } from '@/lib/courses-data';
import { Logo } from '@/components/logo';
import { useSearchParams } from 'next/navigation';
import { useMemo, Suspense } from 'react';
import { doc, DocumentReference } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Award, ArrowLeft, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ADMIN_EMAILS } from '@/lib/constants';

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
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const purchaseId = searchParams?.get('id') as string | undefined;

  const isAdmin = useMemo(() => (user?.email ? ADMIN_EMAILS.includes(user.email.trim().toLowerCase()) : false), [user?.email]);
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


  const purchaseDocRef = useMemoFirebase(() => {
    if (!user?.uid || !purchaseId || !firestore || isAdminPreview) return null;
    return doc(firestore, 'users', user.uid, 'purchases', purchaseId) as DocumentReference<Purchase>;
  }, [firestore, user?.uid, purchaseId, isAdminPreview]);

  const { data: fetchedPurchase, isLoading: purchaseLoading } = useDoc<Purchase>(purchaseDocRef);
  
  const purchase = isAdminPreview ? mockPurchase : fetchedPurchase;

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
                        src="https://i.postimg.cc/h4Qm1pwR/Certificado.png"
                        alt="Fundo do Certificado Nexus"
                        fill
                        className="object-cover opacity-100"
                        data-ai-hint="nexus certificate background"
                    />
                </div>
                
                <div className="relative z-10 flex flex-col items-center pt-64 md:pt-80">
                    <h1 className={cn("text-2xl font-bold tracking-tight uppercase text-accent mb-6 drop-shadow-md", "font-headline")}>
                        Certificado de Conclusão
                    </h1>

                    <p className="text-lg text-muted-foreground mb-4">
                        Certificamos que
                    </p>

                    <p className="text-5xl md:text-6xl font-extrabold text-primary font-headline tracking-wider mb-6 leading-tight">
                        {user.displayName}
                    </p>

                    <p className="max-w-3xl text-base md:text-lg text-muted-foreground mb-8">
                        concluiu com êxito o curso <strong className="text-foreground font-semibold">{course.title}</strong>, com carga horária de {course.lessons * 2} horas, desenvolvendo competências humanas, interpessoais e práticas para fortalecer relações, ampliar consciência e evoluir em sua jornada profissional e pessoal.
                    </p>
                    
                    <div className="bg-primary/10 rounded-lg p-4 max-w-3xl mb-12 border border-primary/20">
                        <p className="text-base text-muted-foreground">
                            O participante demonstrou dedicação, abertura ao aprendizado e compromisso com o desenvolvimento contínuo, alinhado aos valores da Nexus: <strong className="text-foreground">Humanidade, Confiança, Ética e Respeito.</strong>
                        </p>
                    </div>


                    <div className="flex flex-col items-center justify-center gap-2 rounded-full border-2 border-dashed border-accent/50 p-4 mb-16 w-80">
                        <Award className="w-8 h-8 text-accent" />
                        <p className="font-semibold text-accent text-center">Aprovado com Humanidade, Confiança e Respeito</p>
                        <p className="text-xs font-bold tracking-wider text-muted-foreground">NEXUS TREINAMENTO</p>
                    </div>

                    <p className="text-sm text-muted-foreground mt-12">Data de Conclusão: {completionDate}</p>

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
