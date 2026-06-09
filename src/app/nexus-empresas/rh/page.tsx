'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Award, 
  BrainCircuit, 
  ArrowRight, 
  ShieldCheck, 
  Activity,
  Heart,
  Target,
  Zap,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';

const modules = [
  {
    title: 'Recrutamento War Room',
    description: 'Inteligência de seleção conduzida pela Djeny. Entrevistas por vídeo com análise de perfil em tempo real.',
    icon: UserPlus,
    href: '/intelligence/recrutamento',
    color: 'blue',
    badge: 'LIVE_SELECTION',
    image: 'https://i.postimg.cc/QCF54Yyf/Djeny-RH-Nexus.png'
  },
  {
    title: 'Engenharia de Mérito',
    description: 'Sistema avançado de ranking e desenvolvimento de talentos baseado em KPIs e comportamento.',
    icon: Award,
    href: '/intelligence/merito',
    color: 'purple',
    badge: 'PERFORMANCE_AI',
    image: 'https://i.postimg.cc/vmfBDtwB/Nexus-RH-Jon.png'
  },
  {
    title: 'Treinamento e Integração',
    description: 'Treinamento e integração de novos talentos com tutoria inteligente e automação de processos.',
    icon: BrainCircuit,
    href: '/intelligence/onboarding',
    color: 'emerald',
    badge: 'SMART_TRAINING',
    image: 'https://i.postimg.cc/wjg8DCPL/Nexus-RH-Djeny.png'
  }
];

export default function RHHubPage() {
  return (
    <SovereignShowcase moduleName="Nexus Intelligence RH" imagePath="/Nexus Intelligence RH/Nexus Intelligence RH.png">
      <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden pb-20">
      {/* AMBIENT */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-8">
          <button onClick={() => window.history.back()} className="hover:text-primary transition-colors flex items-center gap-2">
            <ChevronLeft className="h-3 w-3" /> VOLTAR
          </button>
          <ArrowRight className="h-3 w-3" />
          <span className="text-primary">RH & Pessoas</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 space-y-6"
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1 text-[10px] font-black tracking-widest uppercase">
              Nexus HR Management System
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase font-headline">
              Gestão de <span className="text-primary">Talentos</span> de Elite
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
              Potencialize o capital humano da sua organização com a inteligência da Djeny. Do recrutamento estratégico à engenharia de mérito.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild className="bg-primary hover:bg-primary/80 text-black font-black uppercase tracking-widest px-8 h-12 rounded-2xl">
                <Link href="/intelligence/recrutamento">Iniciar Recrutamento</Link>
              </Button>
              <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-widest px-8 h-12 rounded-2xl">
                Ver Dashboard Geral
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 relative aspect-square max-w-md w-full"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
            <Image 
              src="https://i.postimg.cc/52CR78kS/Nexus-Intelligence-RH.png" 
              alt="RH Intelligence" 
              fill 
              className="object-contain relative z-10"
            />
          </motion.div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group bg-slate-900/40 border-white/5 backdrop-blur-xl hover:border-primary/30 transition-all duration-500 rounded-[32px] overflow-hidden h-full flex flex-col">
                <div className="relative h-48 bg-slate-950/50 overflow-hidden">
                  <Image 
                    src={mod.image} 
                    alt={mod.title} 
                    fill 
                    className="object-contain p-8 transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-slate-900/80 text-primary border-primary/20 text-[9px] font-black tracking-widest">
                      {mod.badge}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <mod.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Módulo RH</span>
                  </div>
                  <CardTitle className="text-2xl font-black text-white uppercase tracking-tight font-headline">{mod.title}</CardTitle>
                  <CardDescription className="text-slate-400 text-sm leading-relaxed">
                    {mod.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                  <Button asChild variant="ghost" className="w-full justify-between group/btn text-primary hover:text-white hover:bg-primary/20 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                    <Link href={mod.href} className="flex items-center justify-between w-full">
                      Acessar Módulo
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats/Info */}
        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Colaboradores', value: '1.240', icon: Users },
            { label: 'Score de Clima', value: '92%', icon: Heart },
            { label: 'Vagas Abertas', value: '12', icon: Activity },
            { label: 'Engenharia de Mérito', value: 'Ativo', icon: ShieldCheck },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center space-y-2"
            >
              <div className="flex justify-center">
                <stat.icon className="h-6 w-6 text-primary/40" />
              </div>
              <p className="text-3xl font-black text-white font-headline">{stat.value}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 pb-24 mt-12">
          <LegalSafeguard module="NEXUS RH" protocol="NX-RH-CORE-00" />
        </div>
      </div>
      </div>
    </SovereignShowcase>
  );
}
