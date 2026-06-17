
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MessageSquare, ShieldCheck, Settings, Landmark } from 'lucide-react';
import Link from 'next/link';

export default function DanteComprasAccessPage() {
  const whatsappMessage = `Olá! Gostaria de agendar uma demonstração privada do Módulo Compras e obter informações sobre o Licenciamento Corporativo Soberano.`;
  const whatsappUrl = `https://wa.me/5551999799582?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="flex flex-col h-full items-center justify-center text-white py-12 px-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/intelligence/compras">
            <ArrowLeft className="h-6 w-6 hover:text-blue-400 transition-colors cursor-pointer" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-blue-300 font-headline">
              Módulo Compras.
            </h1>
            <p className="text-sm text-gray-400">O Auditor analisa o mercado e você negocia com os fornecedores em tempo real.</p>
          </div>
        </div>

        <Card className="bg-gray-900/50 border-blue-700/50 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-950/80 border border-blue-500/40 flex items-center justify-center mb-3">
              <ShieldCheck className="h-6 w-6 text-blue-400" />
            </div>
            <CardTitle className="text-2xl text-blue-400 font-headline">Licenciamento Soberano</CardTitle>
            <CardDescription className="text-gray-300">
              Proteção contra assimetrias de mercado e maximização de margens para grandes mesas de negociação.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-black/40 border border-zinc-800 rounded-lg p-4 space-y-4">
              <div className="flex items-start gap-3">
                <Landmark className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-gray-200">Alta Ancoragem Patrimonial</h4>
                  <p className="ml-4 text-emerald-300">O Auditor está analisando o mercado...</p>
                  <p className="text-xs text-gray-400">Desenvolvido sob medida para auditorias de minutas industriais e intermediação inteligente de fornecedores.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Settings className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-gray-200">Customização de Playbook</h4>
                  <p className="text-xs text-gray-400">Integração completa ao manual de compras de sua corporação e retreino de arquétipos comportamentais.</p>
                </div>
              </div>
            </div>

            <div className="text-center py-2">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
                Acesso Sob Consulta • Exclusivo B2B
              </span>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-500 text-white h-12 font-bold transition-all shadow-lg hover:shadow-blue-500/20">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Falar com Consultor Especialista
              </a>
            </Button>
            
            <p className="text-[10px] text-center text-gray-500 max-w-xs mx-auto">
              Requisitos mínimos: Faturamento corporativo e aprovação de compliance Nexus Intelligence.
            </p>
          </CardFooter>
        </Card>
        
        <div className="text-center mt-6">
          <Button asChild variant="link" className="text-blue-400 text-xs hover:text-blue-300">
            <Link href="/intelligence/compras/trial">
              Ou, iniciar período de avaliação de 24h grátis
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
