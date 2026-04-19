
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, FileText, Loader2, PlusCircle, ServerCrash } from 'lucide-react';
import Link from 'next/link';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MeritIndex {
    id: string;
    employeeName: string;
    evaluationDate: string;
    finalMeritIndex: number;
}

export default function MeritoPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const meritIndicesQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        // This page is protected by AuthGate for admins only.
        // Therefore, we query for all merit indices.
        return query(
            collection(firestore, 'merit_indices'),
            orderBy('evaluationDate', 'desc')
        );
    }, [user, firestore]);

    const { data: evaluations, isLoading: areEvaluationsLoading, error } = useCollection<MeritIndex>(meritIndicesQuery);

    const isLoading = isUserLoading || areEvaluationsLoading;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter text-foreground font-headline">
          Gabinete da Inovação / Arquivo de Mérito
        </h1>
        <p className="text-lg text-muted-foreground">
          Registros de todas as avaliações de mérito (IMN) conduzidas e auditadas pela Djeny.
        </p>
      </div>

       <Card className="bg-zinc-950/60 border-2 border-primary/20 backdrop-blur-md shadow-xl shadow-black/40">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Avaliações Conduzidas</span>
             <Button asChild>
                <Link href="/djeny">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nova Avaliação
                </Link>
            </Button>
          </CardTitle>
          <CardDescription>
            Visualize, imprima e gerencie os certificados de mérito de sua equipe.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading && (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
            {!isLoading && error && (
                <div className="text-center py-10 px-4 bg-destructive/10 rounded-lg">
                    <ServerCrash className="mx-auto h-12 w-12 text-destructive" />
                    <h3 className="mt-2 text-lg font-semibold text-destructive-foreground">Erro ao carregar avaliações.</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Não foi possível buscar os registros. Verifique as permissões do seu usuário.</p>
                </div>
            )}
            {!isLoading && !error && evaluations && (
                evaluations.length === 0 ? (
                     <div className="text-center py-10 px-4 border-2 border-dashed rounded-lg">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-2 text-lg font-semibold text-foreground">Nenhum registro encontrado.</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Você ainda não conduziu nenhuma avaliação de mérito.</p>
                        <Button asChild className="mt-4">
                            <Link href="/djeny">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Realizar Primeira Avaliação
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {evaluations.map(eva => (
                             <Card key={eva.id} className="bg-zinc-900/50 border-2 border-primary/10 hover:border-primary/40 hover:scale-[1.02] transition-all duration-300 shadow-lg group">
                                <CardHeader>
                                     <CardTitle className="flex items-start justify-between">
                                        <span className="font-headline text-lg text-white">{eva.employeeName}</span>
                                        <Award className="h-6 w-6 text-primary" />
                                    </CardTitle>
                                    <CardDescription>
                                        Avaliado em {format(new Date(eva.evaluationDate), "dd/MM/yyyy", { locale: ptBR })}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">Índice de Mérito Nexus (IMN)</p>
                                    <p className="text-3xl font-bold text-primary">{eva.finalMeritIndex.toFixed(1)}</p>
                                </CardContent>
                                <CardContent>
                                    <Button asChild className="w-full" variant="outline">
                                        <Link href={`/gabinete/merito/view?id=${eva.id}`}>
                                            Ver Certificado
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )
            )}
        </CardContent>
      </Card>

    </div>
  );
}
