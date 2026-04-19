
'use client';

import React from 'react';
import { OrionOSModule } from '@/components/maga/orion-os-module';
import { motion } from 'framer-motion';
import { Target, Shield, Cpu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function OrionOSPage() {
  return (
    <main className="min-h-screen bg-[#020617] relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-slate-900/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-800/20 blur-[120px] rounded-full" />
      </div>

      <div className="container max-w-7xl relative z-10 w-full">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline" className="border-slate-700 text-slate-400 bg-slate-950/50 backdrop-blur-md px-3 py-1">
              <Target className="w-4 h-4 mr-2" />
              GABINETE ESTRATÉGICO
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-white tracking-widest mb-4">
            ORION <span className="text-slate-400">OS</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg italic">
            "A precisão da análise tática encontra a inteligência executiva da Nexus."
          </p>
        </motion.div>

        {/* Orion OS Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <OrionOSModule />
        </motion.div>

        {/* Footer Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500"
        >
          <div className="flex items-center gap-2 text-slate-300">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-mono tracking-widest uppercase">Encryption: Elite</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Cpu className="w-5 h-5" />
            <span className="text-sm font-mono tracking-widest uppercase">Core: Strategic v4</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
