'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo, Suspense } from 'react';
import { doc, DocumentReference } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Award, ArrowLeft, ShieldAlert, Printer, CheckCircle, MessageSquare, Activity, Heart, Lightbulb, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { getCourseBySlug } from '@/lib/courses-data';
import { ADMIN_EMAILS } from '@/lib/constants';

interface MeritIndex {
    id: string;
    employeeName: string;
    evaluatorId: string;
    evaluatorName: string;
    evaluationDate: string;
    scores: {
        behavior: number;
        technique: number;
        presence: number;
    };
    justifications: {
        behavior: string;
        technique: string;
        presence: string;
    };
    finalMeritIndex: number;
    auditedBy: string;
    recommendedCourseSlug?: string;
    recommendationReason?: string;
}

const CertificateSkeleton = () => (
    <div>
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="bg-card p-8 md:p-12 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-24 w-full" />
                </div>
                <div className="md:col-span-2 space-y-6">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            </div>
            <Skeleton className="h-10 w-full mt-8" />
        </div>
    </div>
);

const NotFoundState = () => (
    <div className="container mx-auto py-12 md:py-20 text-center">
        <ShieldAlert className="mx-auto h-24 w-24 text-destructive" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-destructive">Avaliação não encontrada.</h1>
        <p className="mt-2 text-lg text-muted-foreground">
            Não foi possível localizar este registro. Verifique se você tem permissão ou se o link está correto.
        </p>
        <div className="mt-8">
            <Button asChild>
                <Link href="/gabinete/merito">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para o Arquivo de Mérito
                </Link>
            </Button>
        </div>
    </div>
)


function MeritCertificateContent() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const searchParams = useSearchParams();
    const router = useRouter();
    const meritId = searchParams?.get('id') as string;

    const meritDocRef = useMemoFirebase(() => {
        if (!user?.uid || !meritId || !firestore) return null;
        return doc(firestore, 'merit_indices', meritId) as DocumentReference<MeritIndex>;
    }, [firestore, user?.uid, meritId]);

    const { data: evaluation, isLoading: evaluationLoading } = useDoc<MeritIndex>(meritDocRef);

    const isAdmin = useMemo(() => user?.email ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false, [user?.email]);

    const recommendedCourse = useMemo(() => {
        if (!evaluation?.recommendedCourseSlug) return null;
        return getCourseBySlug(evaluation.recommendedCourseSlug);
    }, [evaluation]);

    const isLoading = isUserLoading || evaluationLoading;

    if (isLoading) {
        return <CertificateSkeleton />;
    }

    if (!evaluation || !user || (evaluation.evaluatorId !== user.uid && !isAdmin)) {
        return <NotFoundState />;
    }

    const evaluationDateFormatted = format(new Date(evaluation.evaluationDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    const categoryTitles = {
        behavior: 'Comportamento',
        technique: 'Desempenho Técnico',
        presence: 'Presença e Atitude',
    }
    const categoryIcons = {
        behavior: Heart,
        technique: Activity,
        presence: MessageSquare,
    }


    return (
        <div className="space-y-8 print:space-y-4">
            <div className="flex justify-between items-center print:hidden">
                <Button asChild variant="outline">
                    <Link href="/gabinete/merito">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar ao Arquivo
                    </Link>
                </Button>
                <Button onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir / Salvar PDF
                </Button>
            </div>

            <div className="@container p-8 md:p-12 rounded-xl border-2 border-primary bg-card text-card-foreground shadow-2xl relative overflow-hidden">
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center z-0 opacity-5 pointer-events-none">
                    <Image
                        src="https://i.postimg.cc/SKxtC9Ph/Logo-estilizado-para.png"
                        alt="Nexus Intelligence Logo"
                        width={500}
                        height={100}
                        className="object-contain"
                    />
                </div>

                <div className="relative z-10">
                    <header className="text-center mb-10">
                        <Image
                            src="https://i.postimg.cc/SKxtC9Ph/Logo-estilizado-para.png"
                            alt="Nexus Intelligence Logo"
                            width={300}
                            height={101}
                            className="mx-auto mb-4 object-contain"
                        />
                        <h1 className="text-3xl font-bold font-headline text-primary">Certificado de Índice de Mérito Nexus (IMN)</h1>
                        <p className="text-muted-foreground">Documento de auditoria de performance conduzido por líder e validado pela IA Djeny.</p>
                    </header>

                    <div className="grid grid-cols-1 @2xl:grid-cols-3 gap-x-8 gap-y-10">
                        <aside className="@2xl:col-span-1 space-y-6">
                            <Card className="bg-secondary/50">
                                <CardHeader>
                                    <CardTitle className="font-headline text-lg">Colaborador Avaliado</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold text-foreground">{evaluation.employeeName}</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-secondary/50">
                                <CardHeader>
                                    <CardTitle className="font-headline text-lg">Resultado Final (IMN)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-6xl font-bold text-accent">{evaluation.finalMeritIndex.toFixed(1)}</p>
                                    <p className="text-sm text-muted-foreground">Média das 3 categorias</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-secondary/50 text-sm">
                                <CardHeader>
                                    <CardTitle className="font-headline text-lg">Detalhes da Auditoria</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p><strong className="text-muted-foreground">Data:</strong> {evaluationDateFormatted}</p>
                                    <p><strong className="text-muted-foreground">Líder Avaliador:</strong> {evaluation.evaluatorName}</p>
                                    <p><strong className="text-muted-foreground">Auditoria:</strong> {evaluation.auditedBy}</p>
                                </CardContent>
                            </Card>
                        </aside>

                        <main className="@2xl:col-span-2 space-y-6">
                            {(Object.keys(evaluation.scores) as Array<keyof typeof evaluation.scores>).map(key => {
                                const Icon = categoryIcons[key];
                                return (
                                    <div key={key}>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-grow flex items-center gap-3">
                                                <Icon className="h-6 w-6 text-primary" />
                                                <h2 className="text-xl font-headline font-bold text-foreground">{categoryTitles[key]}</h2>
                                            </div>
                                            <div className="text-3xl font-bold text-primary">{evaluation.scores[key]}/10</div>
                                        </div>
                                        <div className="mt-2 pl-10">
                                            <p className="text-sm text-muted-foreground italic">"{evaluation.justifications[key]}"</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </main>
                    </div>

                    {recommendedCourse && (
                        <div className="mt-10">
                            <Separator className="my-6" />
                            <Card className="border-accent/50 bg-accent/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 font-headline text-accent">
                                        <Lightbulb />
                                        Plano de Desenvolvimento Recomendado
                                    </CardTitle>
                                    <CardDescription>
                                        Com base na auditoria, a DJENY recomenda o seguinte treinamento para acelerar a evolução deste colaborador.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <h3 className="font-bold text-lg text-foreground">{recommendedCourse.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 mb-4">{recommendedCourse.description}</p>
                                    <Button asChild size="sm" variant="outline" className="border-accent text-accent hover:bg-accent/20 hover:text-accent">
                                        <Link href={`/courses/${recommendedCourse.slug}`} target="_blank">
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            Ver Detalhes do Curso
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}


                    <footer className="mt-12 text-center">
                        <Separator className="my-6" />
                        <div className="flex items-center justify-center gap-2 text-green-400">
                            <CheckCircle className="h-5 w-5" />
                            <p className="font-bold text-sm">AVALIAÇÃO CONCLUÍDA E REGISTRADA NO ARQUIVO DE MÉRITO</p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}

export default function MeritCertificatePage() {
    return (
        <Suspense fallback={<CertificateSkeleton />}>
            <MeritCertificateContent />
        </Suspense>
    );
}
