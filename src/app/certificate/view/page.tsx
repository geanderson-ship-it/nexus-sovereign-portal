'use client';

import { useUser } from '@/auth';
import { allCourses } from '@/lib/courses-data';
import { useSearchParams } from 'next/navigation';
import { useMemo, Suspense } from 'react';
import { useNickname } from '@/hooks/use-nickname';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Purchase {
  id: string;
  userId: string;
  courseId: string;
  purchaseDate: string;
  price: number;
}

/* ---------- Estados auxiliares ---------- */

const CertificateSkeleton = () => (
  <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12">
    <div className="w-full max-w-md rounded-2xl border-4 border-primary/30 bg-zinc-900 overflow-hidden">
      <Skeleton className="h-56 w-full" />
      <div className="p-6 flex flex-col items-center gap-3">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  </div>
);

const NotFoundState = () => (
  <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
    <div className="text-center">
      <ShieldAlert className="mx-auto h-20 w-20 text-destructive mb-4" />
      <h1 className="text-2xl font-bold text-destructive mb-2">Certificado não encontrado.</h1>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        Não foi possível localizar o seu certificado. Verifique se você está logado na conta correta.
      </p>
      <Button asChild>
        <Link href="/profile">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a Área do Aluno
        </Link>
      </Button>
    </div>
  </div>
);

/* ---------- Conteúdo principal ---------- */

function CertificateContent() {
  const { user, isUserLoading } = useUser();
  const searchParams = useSearchParams();
  const purchaseId = searchParams?.get('id') as string | undefined;

  const course = useMemo(() => {
    if (!purchaseId) return null;
    return allCourses.find(c => purchaseId.includes(c.slug));
  }, [purchaseId]);

  const purchase = useMemo<Purchase | null>(() => {
    if (!course || !user) return null;
    return {
      id: purchaseId || 'preview-access',
      userId: user.uid,
      courseId: course.slug,
      purchaseDate: new Date().toISOString(),
      price: course.discountedPrice || 0,
    };
  }, [course, user, purchaseId]);

  const { nickname } = useNickname(user?.email);

  const studentName = useMemo(() => {
    if (!user) return 'Membro do Clã';

    // 1. Nome real do cadastro Cognito (name ou given_name)
    const cognitoName =
      user.name ||
      (user.given_name ? `${user.given_name} ${user.family_name || ''}`.trim() : null);
    if (cognitoName) return cognitoName;

    // 2. Apelido salvo pelo aluno na página de perfil
    if (nickname) return nickname;

    // 3. displayName — só usar se não for o prefixo do e-mail
    const emailPrefix = user.email?.split('@')[0] || '';
    const isEmailPrefix = user.displayName === emailPrefix;
    if (user.displayName && !isEmailPrefix) return user.displayName;

    // 4. Fallback genérico
    return 'Membro do Clã';
  }, [user, nickname]);

  if (isUserLoading) return <CertificateSkeleton />;
  if (!purchase || !course || !user) return <NotFoundState />;

  const completionDate = format(
    new Date(purchase.purchaseDate),
    "dd 'de' MMMM 'de' yyyy",
    { locale: ptBR }
  );

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center py-10 px-4">

      {/* Botão voltar */}
      <div className="w-full max-w-md mb-4 self-start" style={{ maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto' }}>
        <Button asChild variant="ghost" className="text-primary hover:text-primary/80">
          <Link href="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a Área do Aluno
          </Link>
        </Button>
      </div>

      {/* Cartão do certificado — VERTICAL (portrait) */}
      <div className="w-full max-w-md rounded-2xl border-4 border-amber-500/40 bg-zinc-950 shadow-2xl shadow-amber-900/20 overflow-hidden flex flex-col">

        {/* Brasão — topo, altura controlada */}
        <div className="relative w-full h-56 shrink-0">
          <Image
            src="/Certificado/Certificado..png"
            alt="Brasão Nexus"
            fill
            className="object-cover object-center"
            style={{ filter: 'brightness(1.4) contrast(1.1) saturate(1.1)' }}
            priority
          />
          {/* Fade para o corpo escuro abaixo */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-zinc-950 to-transparent" />
        </div>

        {/* Inscrições — abaixo do brasão, totalmente separadas */}
        <div className="flex flex-col items-center text-center px-6 pb-8 pt-3 gap-3">

          <h1 className="text-sm font-black tracking-[0.25em] uppercase text-amber-400 font-headline">
            Certificado de Excelência
          </h1>

          <p className="text-[11px] text-neutral-400 italic tracking-wide">
            Certificamos com honra e distinção que
          </p>

          <p className="text-2xl font-black uppercase tracking-widest font-headline bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent leading-tight">
            {studentName}
          </p>

          <p className="text-[11px] text-neutral-300 leading-relaxed max-w-xs">
            concluiu com êxito o programa de formação executiva em{' '}
            <strong className="text-amber-400 font-semibold">{course.title}</strong>,
            demonstrando competência estratégica e alinhamento com as diretrizes do Clã Nexus.
          </p>

          {/* Pilares */}
          <div className="w-full bg-black/50 border border-amber-500/20 rounded-xl px-4 py-3">
            <p className="text-[9px] text-neutral-500 mb-1">
              Homologação realizada sob os pilares morais da holding:
            </p>
            <p className="text-[11px] text-amber-400 font-bold tracking-widest uppercase">
              Humanidade • Respeito • Ética • Confiança
            </p>
          </div>

          {/* Assinatura */}
          <div className="flex flex-col items-center gap-0.5 mt-1">
            <div className="w-40 border-t border-amber-500/30 mb-1.5" />
            <p className="text-[9px] font-bold tracking-widest text-amber-500 uppercase font-headline">
              Nexus Holding Group / Treinamento / Intelligence
            </p>
            <p className="text-[8px] text-neutral-500 tracking-widest uppercase">
              Assinatura Digital &amp; Homologação Manual
            </p>
          </div>

          <p className="text-[8px] text-neutral-600 font-mono tracking-wider">
            Data de Homologação: {completionDate}
          </p>

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
