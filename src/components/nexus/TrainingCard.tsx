'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Clock, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TrainingCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  status: 'locked' | 'available' | 'completed' | 'in-progress';
  type: 'seguranca' | 'norma' | 'tecnico' | 'cultura';
  duration?: string;
  onStart?: () => void;
}

export function TrainingCard({ title, description, icon: Icon, status, type, duration, onStart }: TrainingCardProps) {
  const typeColors = {
    seguranca: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    norma: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    tecnico: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    cultura: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  };

  const statusIcons = {
    locked: <Lock className="h-4 w-4" />,
    available: <Play className="h-4 w-4" />,
    'in-progress': <Clock className="h-4 w-4" />,
    completed: <CheckCircle className="h-4 w-4" />,
  };

  const isLocked = status === 'locked';

  return (
    <motion.div
      whileHover={!isLocked ? { scale: 1.02, y: -5 } : {}}
      className={cn(
        "group relative rounded-[32px] border bg-slate-900/40 p-6 flex flex-col gap-4 transition-all duration-300",
        isLocked ? "border-white/5 opacity-50 grayscale cursor-not-allowed" : "border-white/10 hover:border-primary/40",
        status === 'completed' && "border-emerald-500/30 bg-emerald-500/5"
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn("p-3 rounded-2xl border", typeColors[type])}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge className={cn(
            "text-[9px] font-black uppercase tracking-widest px-3 py-1 border-none",
            status === 'locked' && "bg-slate-800 text-slate-500",
            status === 'available' && "bg-blue-600 text-white",
            status === 'in-progress' && "bg-amber-600 text-white animate-pulse",
            status === 'completed' && "bg-emerald-600 text-white"
          )}>
            {status}
          </Badge>
          {duration && <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{duration}</span>}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-black text-white uppercase tracking-tight font-headline italic">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed min-h-[40px]">{description}</p>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
          {type}
        </div>
        
        {status === 'completed' ? (
          <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
            <CheckCircle className="h-4 w-4" /> Certificado
          </div>
        ) : (
          <Button 
            disabled={isLocked}
            onClick={onStart}
            size="sm"
            className={cn(
              "h-9 rounded-xl font-black uppercase tracking-widest text-[9px] px-6 transition-all",
              status === 'available' ? "bg-primary text-black hover:bg-primary/80" : "bg-white/5 text-white/50 border border-white/10"
            )}
          >
            {isLocked ? 'Bloqueado' : status === 'in-progress' ? 'Continuar' : 'Iniciar'}
          </Button>
        )}
      </div>

      {isLocked && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[2px] rounded-[32px]">
          <div className="bg-slate-900 border border-white/10 p-4 rounded-2xl shadow-2xl flex flex-col items-center gap-2">
            <Lock className="h-6 w-6 text-slate-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">Módulo Bloqueado</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
