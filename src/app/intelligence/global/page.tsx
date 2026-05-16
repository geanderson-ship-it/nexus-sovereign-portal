'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, HeartPulse, Tractor, Factory, Radio, Activity, Zap, ShieldCheck, ArrowUpRight, ArrowDownRight, Server, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// --- Types ---
type MetricStatus = 'optimal' | 'warning' | 'critical';

interface WidgetData {
  title: string;
  icon: React.ElementType;
  value: string;
  label: string;
  trend: string;
  trendUp: boolean;
  status: MetricStatus;
  color: string;
  glowColor: string;
  href?: string;
}

export default function NexusGlobalPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [pulseScale, setPulseScale] = useState(1);

  // Mocks dinâmicos
  const [metrics, setMetrics] = useState({
    agroHectares: 1250430,
    healthLives: 45289,
    industryEfficiency: 98.4,
    studioListeners: 154200,
  });

  useEffect(() => {
    setIsMounted(true);

    // Efeito de pulso para o "Coração" do sistema
    const pulseInterval = setInterval(() => {
      setPulseScale(prev => prev === 1 ? 1.05 : 1);
    }, 2000);

    // Atualização dinâmica suave dos números para parecer vivo
    const dataInterval = setInterval(() => {
      setMetrics(prev => ({
        agroHectares: prev.agroHectares + Math.floor(Math.random() * 5),
        healthLives: prev.healthLives + Math.floor(Math.random() * 3),
        industryEfficiency: prev.industryEfficiency > 99 ? 98.4 : prev.industryEfficiency + 0.1,
        studioListeners: prev.studioListeners + (Math.random() > 0.5 ? 12 : -5),
      }));
    }, 3000);

    return () => {
      clearInterval(pulseInterval);
      clearInterval(dataInterval);
    };
  }, []);

  if (!isMounted) return <div className="min-h-screen bg-[#020617]" />;

  const widgets: WidgetData[] = [
    {
      title: "Dante Safra",
      icon: Tractor,
      value: `${metrics.agroHectares.toLocaleString('pt-BR')} ha`,
      label: "Área Total Monitorada",
      trend: "+1.2%",
      trendUp: true,
      status: "optimal",
      color: "text-green-400",
      glowColor: "rgba(74, 222, 128, 0.2)",
      href: "/intelligence/dante-safra",
    },
    {
      title: "Nexus Health",
      icon: HeartPulse,
      value: `${metrics.healthLives.toLocaleString('pt-BR')}`,
      label: "Vidas Salvas / Atendidas",
      trend: "+5.4%",
      trendUp: true,
      status: "optimal",
      color: "text-rose-400",
      glowColor: "rgba(251, 113, 133, 0.2)",
      href: "/intelligence/health",
    },
    {
      title: "Cronoanálise Industrial",
      icon: Factory,
      value: `${metrics.industryEfficiency.toFixed(1)}%`,
      label: "Eficiência Média (53min)",
      trend: "+0.8%",
      trendUp: true,
      status: "optimal",
      color: "text-blue-400",
      glowColor: "rgba(96, 165, 250, 0.2)",
      href: "/intelligence/cronoanalise",
    },
    {
      title: "Broadcast Studio",
      icon: Radio,
      value: `${(metrics.studioListeners / 1000).toFixed(1)}k`,
      label: "Ouvintes Simultâneos",
      trend: "-0.2%",
      trendUp: false,
      status: "warning",
      color: "text-amber-400",
      glowColor: "rgba(251, 191, 36, 0.2)",
      href: "/intelligence/studio",
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 relative overflow-hidden font-sans">
      
      {/* Background Ambient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Universe Network Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
          style={{ backgroundImage: 'url(/nexus-global/universe_network_bg.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/90 via-[#020617]/40 to-[#020617]/80 pointer-events-none" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1200px] max-h-[1200px] bg-blue-900/20 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '6s' }} />
      </div>

      <div className="relative z-10 w-full mb-8">
        {/* Header - Full Width */}
        <header className="relative w-full border-b border-white/5 bg-black/20">
          <img 
            src="/nexus-global/nexus-global-logo.png" 
            alt="Nexus Intelligence Global" 
            className="w-full h-auto object-cover min-h-[20vh] md:min-h-[40vh] max-h-[70vh]"
          />

          <div className="absolute top-4 right-4 hidden md:flex items-center gap-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-2 px-4 shadow-2xl">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">System Online</span>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
              <Server className="h-3 w-3" />
              <span>LATENCY: 12ms</span>
            </div>
          </div>
        </header>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8 flex-1 flex flex-col px-4 md:px-0">
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
          
          {/* Left Column: Metrics 1 & 2 */}
          <div className="lg:col-span-3 space-y-6 flex flex-col justify-center">
            <WidgetCard data={widgets[0]} />
            <WidgetCard data={widgets[1]} />
          </div>

          {/* Center Column: The Globe (Olimpo) */}
          <div className="lg:col-span-6 flex items-center justify-center relative min-h-[350px] md:min-h-[400px] my-10 lg:my-0">
            {/* Holographic Globe Container */}
            <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] flex items-center justify-center">
              
              {/* Radar Rings */}
              <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-ping" style={{ animationDuration: '4s' }} />
              <div className="absolute inset-4 rounded-full border border-cyan-500/30" />
              
              {/* Central Globe Image */}
              <div className="absolute inset-4 rounded-full overflow-hidden shadow-[0_0_80px_rgba(59,130,246,0.4)] animate-[spin_60s_linear_infinite] border border-blue-500/20">
                <img 
                  src="/nexus-global/logo.jpg" 
                  alt="Nexus Intelligence Global" 
                  className="w-full h-full object-cover rounded-full scale-[1.02]"
                />
                {/* Inner Glow to make it spherical */}
                <div className="absolute inset-0 rounded-full shadow-[inset_0_0_60px_rgba(0,0,0,0.8)] pointer-events-none" />
              </div>

              {/* Data Connections (SVG Lines pointing to widgets) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 hidden lg:block" style={{ zIndex: -1 }}>
                <line x1="20%" y1="30%" x2="-10%" y2="20%" stroke="currentColor" className="text-blue-500" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="20%" y1="70%" x2="-10%" y2="80%" stroke="currentColor" className="text-blue-500" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="80%" y1="30%" x2="110%" y2="20%" stroke="currentColor" className="text-blue-500" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="80%" y1="70%" x2="110%" y2="80%" stroke="currentColor" className="text-blue-500" strokeWidth="1" strokeDasharray="4 4" />
              </svg>

            </div>

            {/* Total Impact Overlay */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl px-8 py-4 text-center min-w-[250px] shadow-2xl">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                Total Impact Events
              </div>
              <div className="text-3xl font-mono font-bold text-white tracking-wider flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400 animate-pulse" />
                18,492,304
              </div>
            </div>

          </div>

          {/* Right Column: Metrics 3 & 4 */}
          <div className="lg:col-span-3 space-y-6 flex flex-col justify-center">
            <WidgetCard data={widgets[2]} alignRight />
            <WidgetCard data={widgets[3]} alignRight />
          </div>

        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide {
          from { transform: translateX(0%); }
          to { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}

function WidgetCard({ data, alignRight = false }: { data: WidgetData, alignRight?: boolean }) {
  const Icon = data.icon;
  
  const CardContent = (
    <motion.div 
      initial={{ opacity: 0, x: alignRight ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "relative bg-black/40 backdrop-blur-lg border border-white/10 p-5 rounded-2xl overflow-hidden group transition-all hover:bg-black/60",
        alignRight ? "lg:text-right text-left" : "text-left",
        data.href ? "cursor-pointer hover:border-white/30 hover:scale-[1.02]" : ""
      )}
      style={{ boxShadow: `0 0 20px ${data.glowColor}` }}
    >
      {/* Background Glow Hover Effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at ${alignRight ? '100%' : '0%'} 50%, ${data.glowColor}, transparent 70%)` }}
      />

      <div className={cn(
        "flex items-center gap-4 mb-4",
        alignRight ? "lg:flex-row-reverse flex-row" : "flex-row"
      )}>
        <div className={cn("p-3 rounded-xl bg-black border border-white/5 shadow-inner", data.color)}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg tracking-tight">{data.title}</h3>
          <p className="text-xs font-medium uppercase tracking-widest text-slate-500">{data.label}</p>
        </div>
      </div>

      <div className={cn(
        "flex items-end gap-3",
        alignRight ? "flex-row-reverse" : "flex-row"
      )}>
        <div className="text-3xl font-black font-mono tracking-tighter text-white">
          {data.value}
        </div>
        <div className={cn(
          "flex items-center gap-1 text-sm font-bold pb-1",
          data.trendUp ? "text-emerald-400" : "text-red-400"
        )}>
          {data.trendUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
          {data.trend}
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full",
            data.status === 'optimal' ? "bg-emerald-500 w-[90%]" : 
            data.status === 'warning' ? "bg-amber-500 w-[60%]" : "bg-red-500 w-[30%]"
          )}
        />
      </div>
    </motion.div>
  );

  if (data.href) {
    return (
      <Link href={data.href} className="block">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}
