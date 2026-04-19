'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, RefreshCw, ArrowLeft, BarChart3, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { cn } from "@/lib/utils";

interface TacticalMarketBoardProps {
  onClose: () => void;
}

export function TacticalMarketBoard({ onClose }: TacticalMarketBoardProps) {
  const commodities = [
    { name: 'SOJA', price: 'R$ 134,50', change: '+1.2%', isUp: true, source: 'B3/SANTOS', detail: 'MAR/25' },
    { name: 'MILHO', price: 'R$ 58,20', change: '-0.5%', isUp: false, source: 'B3/CAMPINAS', detail: 'MAI/25' },
    { name: 'BOI GORDO', price: 'R$ 312,40', change: '+0.8%', isUp: true, source: 'B3', detail: 'À VISTA' },
    { name: 'TRIGO', price: 'R$ 1.250,00', change: '+2.1%', isUp: true, source: 'CBOT/CH', detail: 'JUN/25' },
    { name: 'CAFÉ ARÁBICA', price: 'R$ 1.150,00', change: '-1.2%', isUp: false, source: 'ICE/NY', detail: 'SET/25' },
    { name: 'DÓLAR AGRO', price: 'R$ 5,62', change: '+0.3%', isUp: true, source: 'BANCO_CENTRAL', detail: 'PTAX' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="absolute inset-0 bg-[#050807] z-50 flex flex-col border border-emerald-500/20 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.9)]"
    >
      {/* Header HUD */}
      <header className="h-16 border-b border-emerald-900/30 bg-black/60 backdrop-blur-xl px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-emerald-500 hover:bg-emerald-500/10 rounded-full" onClick={onClose}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-emerald-700 uppercase tracking-[0.3em] font-bold">TERMINAL_COTACAO</span>
            <span className="text-xs font-bold text-emerald-100 tracking-widest font-headline uppercase">MATRIZ_MERCADO // B3_CHICAGO_ICE</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-4">
             <span className="text-[8px] font-mono text-emerald-800 uppercase tracking-tighter">ÚLTIMA_SINCRONIZACAO</span>
             <span className="text-[9px] font-mono text-emerald-400">AGORA: {new Date().toLocaleTimeString()}</span>
          </div>
          <Button variant="ghost" size="icon" className="text-emerald-500 hover:bg-emerald-500/10 rounded-full">
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Market Ticker Ribbon */}
      <div className="h-10 bg-emerald-950/20 border-b border-emerald-900/10 overflow-hidden flex items-center">
         <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 whitespace-nowrap px-6 shrink-0"
         >
            {commodities.concat(commodities).map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-emerald-700">{item.name}:</span>
                 <span className="text-[10px] font-mono text-emerald-50">{item.price}</span>
                 <span className={cn("text-[8px] font-mono", item.isUp ? "text-emerald-500" : "text-red-500")}>
                    {item.change}
                 </span>
              </div>
            ))}
         </motion.div>
      </div>

      {/* Detailed Board Grid */}
      <div className="flex-1 p-8 overflow-y-auto scrollbar-hide">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commodities.map((item, i) => (
              <motion.div 
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0a120f] border border-emerald-900/30 p-6 rounded-[32px] group hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all duration-500 relative overflow-hidden"
              >
                {/* Decorative background grid */}
                <div className="absolute inset-0 bg-grid-emerald opacity-5" />
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                   <div className="flex flex-col">
                      <Badge variant="outline" className="w-fit text-[8px] border-emerald-900 text-emerald-700 bg-black/40 mb-2 tracking-[.2em]">{item.source}</Badge>
                      <h4 className="text-sm font-black text-emerald-100 tracking-widest">{item.name}</h4>
                   </div>
                   <div className={cn(
                     "p-2.5 rounded-2xl bg-black/40 border border-emerald-900/30",
                     item.isUp ? "text-emerald-500" : "text-red-500"
                   )}>
                      {item.isUp ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                   </div>
                </div>

                <div className="space-y-4 relative z-10">
                   <div className="flex flex-col">
                      <span className="text-2xl font-mono font-bold text-emerald-50 tracking-tighter">{item.price}</span>
                      <div className="flex items-center gap-2">
                         <span className={cn("text-sm font-mono", item.isUp ? "text-emerald-500" : "text-red-500")}>{item.change}</span>
                         <span className="text-[10px] text-emerald-800 font-mono">v {item.detail}</span>
                      </div>
                   </div>

                   {/* Mini Visualizer */}
                   <div className="h-8 flex items-end gap-1 px-1">
                      {[...Array(12)].map((_, j) => (
                        <div 
                           key={j} 
                           className={cn("flex-1 bg-emerald-500/20 rounded-full", item.isUp ? "hover:bg-emerald-500" : "hover:bg-red-500")}
                           style={{ height: `${20 + Math.random() * 80}%` }}
                        />
                      ))}
                   </div>
                </div>
              </motion.div>
            ))}
         </div>

         {/* Bottom Data Source Banner */}
         <div className="mt-12 p-6 bg-emerald-950/10 border border-emerald-900/20 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-emerald-500/10 rounded-2xl">
                  <Database className="h-6 w-6 text-emerald-500" />
               </div>
               <div className="flex flex-col">
                  <span className="text-xs font-bold text-emerald-100 tracking-widest uppercase">FONTES_REAIS</span>
                  <p className="text-[10px] text-emerald-800 font-mono">SINCRONIZACAO_ATIVA // PARCERIA_CEPEA_B3_INTER_CBOT</p>
               </div>
            </div>
            
            <div className="flex gap-4">
               <div className="flex flex-col items-end">
                  <span className="text-[9px] text-emerald-900 uppercase font-black tracking-widest">Latência de Fluxo</span>
                  <span className="text-xs font-mono text-emerald-400">12ms - ULTRA_FLUX</span>
               </div>
               <div className="w-[1px] h-10 bg-emerald-900/30" />
               <div className="flex flex-col items-end text-emerald-600">
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-[8px] font-mono uppercase font-black mt-1">Status: OK</span>
               </div>
            </div>
         </div>
      </div>
    </motion.div>
  );
}
