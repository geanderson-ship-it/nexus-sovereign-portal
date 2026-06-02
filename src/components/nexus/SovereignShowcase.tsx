'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Eye, Lock, Phone, HelpCircle, CheckCircle, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface SovereignShowcaseProps {
  moduleName: string;
  imagePath: string;
  children: React.ReactNode;
  whatsappUrl?: string;
  whatsappMessage?: string;
}

export function SovereignShowcase({
  moduleName,
  imagePath,
  children,
  whatsappUrl = 'https://wa.me/5551999799582',
  whatsappMessage
}: SovereignShowcaseProps) {
  const { user } = useUser();
  const isAdmin = isAdminUser(user);
  
  // State to toggle visual demo mode vs interactive mode for Admin only
  const [showDemoOnly, setShowDemoOnly] = useState(true);

  // Default whatsapp link message if none provided
  const finalMessage = whatsappMessage || `Olá! Gostaria de agendar uma demonstração privada do Módulo ${moduleName} e obter informações sobre o Licenciamento Corporativo Soberano.`;
  const finalWhatsappLink = `${whatsappUrl}?text=${encodeURIComponent(finalMessage)}`;

  // Set default view: clients only see demo, admins can toggle but start with interactive view
  useEffect(() => {
    if (isAdmin) {
      setShowDemoOnly(false);
    } else {
      setShowDemoOnly(true);
    }
  }, [isAdmin]);

  // If user is Admin and toggles to interactive, or if we want interactive
  if (!showDemoOnly) {
    return (
      <div className="relative">
        {/* Floating Admin Control Panel */}
        {isAdmin && (
          <div className="fixed top-24 left-6 z-[200] bg-slate-900/90 backdrop-blur-xl border-2 border-amber-500/50 rounded-2xl p-3 shadow-2xl flex items-center gap-3 animate-pulse">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Modo Admin Interativo</span>
            <Button 
              size="sm" 
              onClick={() => setShowDemoOnly(true)}
              className="bg-amber-600 hover:bg-amber-500 text-white font-black text-[9px] uppercase tracking-widest h-8 px-3 rounded-lg"
            >
              Simular Visão Cliente
            </Button>
          </div>
        )}
        {children}
      </div>
    );
  }

  // Showcase view (Client view or Admin simulation)
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 space-y-8 relative overflow-hidden flex flex-col justify-between">
      
      {/* AMBIENT GLOWS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
      </div>

      <div className="relative z-10 space-y-6 flex-1 flex flex-col">
        {/* SOVEREIGN SHOWROOM HUD HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[32px] bg-slate-900/40 backdrop-blur-xl border border-white/5 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <Shield className="h-6 w-6 text-blue-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight font-headline italic">
                  {moduleName}
                </h1>
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[8px] font-black tracking-widest uppercase">
                  DEMO_VITRINE
                </Badge>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                Visualização de Alta Fidelidade • Licenciamento Corporativo Requerido
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button 
                onClick={() => setShowDemoOnly(false)}
                className="bg-amber-600/10 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 font-black text-[9px] uppercase tracking-widest h-10 px-4 rounded-xl"
              >
                Ativar Painel Interativo
              </Button>
            )}
            <Button asChild variant="ghost" className="text-slate-500 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl px-5 h-10 text-xs font-black uppercase tracking-widest">
              <Link href="/intelligence">Voltar ao Hub</Link>
            </Button>
          </div>
        </div>

        {/* NOTIFICATION BOX */}
        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 backdrop-blur-md flex items-center gap-3 max-w-4xl mx-auto w-full">
          <Lock className="h-4 w-4 text-blue-400 shrink-0" />
          <p className="text-xs text-slate-400 font-medium">
            Você está no **Showroom Soberano**. Para garantir a segurança dos dados e conformidade comercial, o painel de edição está bloqueado. Veja abaixo os relatórios e inteligências em tempo real gerados na conta demonstrativa ativa.
          </p>
        </div>

        {/* SCREENSHOT WORKSPACE MONITOR FRAME */}
        <div className="flex-1 flex items-center justify-center p-2 md:p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative w-full max-w-7xl aspect-[16/9] rounded-[40px] overflow-hidden border-2 border-white/10 bg-slate-950 shadow-[0_0_80px_rgba(0,0,0,0.8)] group"
          >
            {/* Monitor Glass Reflections */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.02] to-white/0 pointer-events-none z-20" />
            
            {/* Holographic Watermark overlay */}
            <div className="absolute inset-0 bg-radial-gradient z-10 pointer-events-none flex items-center justify-center select-none opacity-20">
              <div className="text-center rotate-[-12deg] tracking-[0.4em] font-black uppercase text-slate-500 text-3xl sm:text-5xl md:text-7xl font-headline opacity-10">
                NEXUS SOVEREIGN
              </div>
            </div>

            {/* High-fidelity static screenshot image */}
            <Image 
              src={imagePath} 
              alt={`${moduleName} Screenshot Showcase`}
              fill
              className="object-cover md:object-contain transition-transform duration-[4s] group-hover:scale-102"
              priority
            />

            {/* Glassmorphic Non-Editable Indicator Badge */}
            <div className="absolute top-6 right-6 z-20 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">
                Modo Somente Leitura (Vitrine)
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* LUXURY FLOATING CTA DOCK */}
      <div className="relative z-10 w-full max-w-4xl mx-auto pt-6 pb-2">
        <div className="p-6 rounded-[32px] bg-slate-900/60 backdrop-blur-2xl border-2 border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.15)] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h4 className="text-lg font-black text-white uppercase tracking-tight italic">
              Adquira o Módulo {moduleName} para Sua Operação
            </h4>
            <p className="text-xs text-slate-400">
              Elimine gargalos com licenciamento perpétuo e suporte corporativo de elite Nexus.
            </p>
          </div>

          <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest px-8 h-12 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-102">
            <a href={finalWhatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Falar com Consultor B2B
            </a>
          </Button>
        </div>
      </div>

    </div>
  );
}
