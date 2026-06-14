'use client';

import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, Heart, Users, MapPin, Target, Activity, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GestaoImpactoPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isUserLoading) {
      if (!user || !isAdminUser(user)) {
        router.push('/login');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#080b10] flex flex-col items-center justify-center text-primary">
        <Lock className="w-12 h-12 mb-4 animate-pulse text-primary/50" />
        <h2 className="text-xl font-headline tracking-widest text-white/50 uppercase">Verificando Credenciais</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b10] text-slate-200 py-20 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-900/30 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/gabinete" className="text-slate-400 hover:text-white transition-colors">
                Gabinete
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-rose-400 font-medium">Gestão de Impacto</span>
            </div>
            <h1 className="text-3xl font-headline font-black text-white flex items-center gap-3">
              <Heart className="w-8 h-8 text-rose-500" />
              Projeto Inteligência com Alma
            </h1>
            <p className="text-slate-400 mt-2">
              Painel de comando e auditoria das iniciativas sociais da Nexus.
            </p>
          </div>
          <Button className="bg-rose-600 hover:bg-rose-700 text-white font-bold gap-2">
            <Target className="w-4 h-4" />
            Cadastrar Nova Instituição
          </Button>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[#0f141f]/80 border-slate-800">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-slate-400 text-sm font-medium">Asilos Atendidos</CardTitle>
              <MapPin className="w-4 h-4 text-rose-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white">0</div>
              <p className="text-xs text-slate-500 mt-1">Instituições cadastradas</p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0f141f]/80 border-slate-800">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-slate-400 text-sm font-medium">Marias & Paulos</CardTitle>
              <Users className="w-4 h-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white">0</div>
              <p className="text-xs text-slate-500 mt-1">Vidas impactadas diretamente</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0f141f]/80 border-slate-800">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-slate-400 text-sm font-medium">IAs Implementadas</CardTitle>
              <Activity className="w-4 h-4 text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white">0</div>
              <p className="text-xs text-slate-500 mt-1">Avatares em operação social</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0f141f]/80 border-slate-800">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-slate-400 text-sm font-medium">Auditoria (Magadot)</CardTitle>
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-emerald-400">100%</div>
              <p className="text-xs text-slate-500 mt-1">Recursos rastreados e seguros</p>
            </CardContent>
          </Card>
        </div>

        {/* LISTA DE INSTITUIÇÕES */}
        <Card className="bg-[#0f141f]/80 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">Instituições Parceiras</CardTitle>
            <CardDescription className="text-slate-400">
              Gerencie os asilos e lares de idosos apadrinhados pela Nexus.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-800 rounded-lg">
              <Heart className="w-12 h-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-300">Nenhuma instituição cadastrada</h3>
              <p className="text-slate-500 max-w-sm mt-2">
                O módulo está pronto para receber os dados do primeiro asilo.
              </p>
              <Button className="mt-6 bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-500/30">
                Adicionar Instituição
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
