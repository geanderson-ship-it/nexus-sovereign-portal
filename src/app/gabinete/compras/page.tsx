'use client';

import { Button } from '@/components/ui/button';
import { FlaskConical, BarChart, FileText, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import * as gtag from '@/lib/gtag';


export default function ComprasPage() {
    const stats = [
        {
          title: 'Cotações Abertas',
          value: '12',
          description: 'Aguardando análise do Dante',
          icon: ShoppingCart,
          color: 'text-blue-400',
          shadow: '[text-shadow:0_0_8px_theme(colors.blue.500)]',
        },
        {
          title: 'Economia no Mês',
          value: 'R$ 12.785,50',
          description: 'Lucro retido por decisões ótimas',
          icon: BarChart,
          color: 'text-emerald-400',
          shadow: '[text-shadow:0_0_8px_theme(colors.emerald.500)]',
        },
        {
          title: 'Votos Vencidos',
          value: '3',
          description: 'Decisões do comprador sob protesto',
          icon: FileText,
          color: 'text-rose-400',
          shadow: '[text-shadow:0_0_8px_theme(colors.rose.500)]',
        },
      ];

  return (
    <div className="space-y-8 text-white relative isolate">
       <div className="absolute inset-0 -z-10 bg-[linear-gradient(theme(colors.emerald.950/0.2)_1px,transparent_1px),linear-gradient(to_right,theme(colors.emerald.950/0.2)_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
       <div className="absolute inset-0 -z-20 bg-black"></div>

        <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tighter font-headline text-emerald-400">
            Gabinete de Compras / War Room
            </h1>
            <p className="text-lg text-gray-400">
            Central de Operações de Suprimentos e Auditoria do Dante.
            </p>
        </div>

        {/* HUD Indicators Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
            <div key={index} className="rounded-lg border-2 border-emerald-500/20 bg-zinc-950/60 p-4 backdrop-blur-md transition-all hover:border-emerald-500/40 hover:bg-zinc-900/80 shadow-lg shadow-black/40">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium tracking-wider text-gray-300">{stat.title}</h3>
                <stat.icon className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                <div className={cn('text-2xl font-bold', stat.color, stat.shadow)}>{stat.value}</div>
                <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
            </div>
            ))}
        </div>

        {/* Command Center - Arena de Teste */}
        <div className="rounded-lg border-2 border-primary/30 p-1 bg-zinc-950/40 backdrop-blur-md shadow-2xl shadow-primary/5">
            <div className="rounded-md border border-primary/20 bg-black/40 p-6">
                <div className="flex items-center gap-4">
                    <FlaskConical className="h-8 w-8 text-primary animate-pulse" />
                    <div>
                    <h2 className="font-headline text-xl text-primary [text-shadow:0_0_8px_theme(colors.blue.500)]">Arena de Teste: Operação "Fogo Cruzado"</h2>
                    <p className="text-gray-400">
                        Acesse o painel principal para iniciar os protocolos de teste de estresse do Dante.
                    </p>
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                    <p className="text-gray-400">
                        Todos os testes de estresse, incluindo o "<span className="font-mono text-primary/80 uppercase">The Truth Test</span>", "<span className="font-mono text-primary/80 uppercase">The Ghost Clock</span>" e o "<span className="font-mono text-primary/80 uppercase">Executive View</span>", são executados a partir da Arena de Teste localizada no Painel Central do Gabinete.
                    </p>
                    <Button asChild className="bg-accent text-black hover:bg-accent/80 font-bold" onClick={() => {
                        gtag.event({
                            action: 'compras_arena_access',
                            category: 'Gabinete',
                            label: 'War Room'
                        });
                    }}>
                        <Link href="/gabinete">Ir para a Arena de Teste</Link>
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
}
