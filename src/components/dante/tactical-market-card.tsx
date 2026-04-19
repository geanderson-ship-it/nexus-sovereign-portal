'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Quote {
  symbol: string;
  price: string;
  change: string;
  isUp: boolean;
}

interface TacticalMarketCardProps {
  quotes: Quote[];
  title?: string;
  className?: string;
}

export function TacticalMarketCard({ quotes, title = "MERCADO_B3_BOLSAS", className }: TacticalMarketCardProps) {
  return (
    <div className={cn(
      "w-full max-w-sm bg-black/60 border border-emerald-900/30 rounded-xl p-4 backdrop-blur-xl shadow-2xl relative overflow-hidden group",
      className
    )}>
      {/* Background Animated Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Activity className="h-3 w-3 text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono text-emerald-500 tracking-[0.2em] uppercase">{title}</span>
        </div>
        <div className="text-[8px] font-mono text-emerald-900 uppercase">FEED_REALTIME_V3</div>
      </div>

      {/* Quotes List */}
      <div className="space-y-3 relative z-10">
        {quotes.map((quote, i) => (
          <div key={i} className="flex items-center justify-between border-b border-emerald-900/10 pb-2 last:border-0 last:pb-0">
             <div className="flex flex-col">
                <span className="text-xs font-bold text-emerald-100 font-headline uppercase">{quote.symbol}</span>
                <span className="text-[8px] font-mono text-emerald-700 tracking-tighter uppercase">{quote.symbol === 'SOJA' ? 'CHICAGO_CBOT' : 'B3_SAO_PAULO'}</span>
             </div>
             <div className="flex flex-col items-end">
                <span className="text-sm font-mono font-bold text-white tracking-widest">{quote.price}</span>
                <div className={cn(
                   "flex items-center gap-1 text-[10px] font-bold",
                   quote.isUp ? "text-emerald-400" : "text-red-400"
                )}>
                   {quote.isUp ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                   <span>{quote.change}</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Footer / Mini Chart Simulation */}
      <div className="mt-4 pt-3 flex items-center gap-1.5 h-6">
         {[40, 20, 60, 30, 80, 50, 90, 70].map((h, i) => (
           <motion.div 
             key={i}
             initial={{ height: 0 }}
             animate={{ height: `${h}%` }}
             transition={{ delay: i * 0.1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
             className="flex-1 bg-emerald-500/20 rounded-t-sm"
           />
         ))}
      </div>
      
      {/* Glitch Overlay (Active on hover) */}
      <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

    </div>
  );
}
