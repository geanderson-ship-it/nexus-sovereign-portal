'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Activity, Lock, AlertTriangle, Fingerprint, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PactumSecureLinkPage() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Simulate secure handshake sequence
    const timers = [
      setTimeout(() => setStep(1), 1500),
      setTimeout(() => setStep(2), 3500),
      setTimeout(() => setStep(3), 6000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-slate-200 relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
      </div>

      <div className="relative z-10 w-full max-w-md p-8 text-center space-y-8">
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex justify-center"
        >
          <div className="relative">
            {step < 3 ? (
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
            ) : (
              <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
            )}
            <div className={`h-24 w-24 rounded-2xl flex items-center justify-center border-2 shadow-2xl backdrop-blur-md relative z-10 transition-colors duration-700 ${step < 3 ? 'bg-blue-500/10 border-blue-500/50' : 'bg-emerald-500/10 border-emerald-500/50'}`}>
              {step < 3 ? (
                <ShieldCheck className="h-12 w-12 text-blue-400 animate-pulse" />
              ) : (
                <Lock className="h-12 w-12 text-emerald-400" />
              )}
            </div>
          </div>
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black font-headline uppercase tracking-widest text-white">
            Nexus Pactum
          </h1>
          <p className="text-sm text-slate-400 uppercase tracking-widest font-bold">
            War Room Access Gateway
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-4">
          <div className="flex items-center gap-3">
            {step >= 0 ? <Activity className="h-4 w-4 text-blue-400 shrink-0" /> : <Loader2 className="h-4 w-4 text-slate-600 animate-spin shrink-0" />}
            <span className={`text-xs font-mono ${step >= 0 ? 'text-blue-400' : 'text-slate-500'}`}>Estabelecendo túnel de ponta a ponta...</span>
          </div>
          
          <div className="flex items-center gap-3">
            {step >= 1 ? <Fingerprint className="h-4 w-4 text-blue-400 shrink-0" /> : <Loader2 className="h-4 w-4 text-slate-600 animate-spin shrink-0" />}
            <span className={`text-xs font-mono ${step >= 1 ? 'text-blue-400' : 'text-slate-500'}`}>Validando Token de Integridade...</span>
          </div>

          <div className="flex items-center gap-3">
            {step >= 2 ? <Lock className="h-4 w-4 text-emerald-400 shrink-0" /> : <Loader2 className="h-4 w-4 text-slate-600 animate-spin shrink-0" />}
            <span className={`text-xs font-mono ${step >= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>Conexão Biométrica Assegurada.</span>
          </div>
        </div>

        {step >= 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-3"
          >
            <AlertTriangle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Aguardando Host</p>
              <p className="text-xs text-slate-400 mt-1">
                Sua conexão segura foi estabelecida com sucesso. Aguarde enquanto o negociador da Nexus inicia a transmissão.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
