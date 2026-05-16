'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Fingerprint, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Os únicos e-mails com "God Mode"
const AUTHORIZED_EMAILS = [
  'geandersonleo@gmail.com',
  'geanderson@nexustreinamento.com'
];

export default function AtenaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState(false);

  // Idealmente, isso seria feito no middleware com a sessão real do usuário (NextAuth/Clerk).
  // Como estamos criando um cofre isolado, faremos uma verificação robusta local por enquanto,
  // que futuramente deve ser acoplada à autenticação real do portal.

  useEffect(() => {
    // Tenta recuperar a sessão local se já tiver feito "login" na Atena
    const storedAuth = localStorage.getItem('atena_auth_email');
    if (storedAuth && AUTHORIZED_EMAILS.includes(storedAuth)) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, []);

  const handleVerify = () => {
    if (AUTHORIZED_EMAILS.includes(emailInput.trim().toLowerCase())) {
      localStorage.setItem('atena_auth_email', emailInput.trim().toLowerCase());
      setIsAuthorized(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  // Enquanto verifica
  if (isAuthorized === null) {
    return <div className="min-h-screen bg-[#020617] flex items-center justify-center" />;
  }

  // Se não estiver autorizado, mostra o "Cofre"
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 relative overflow-hidden">
        {/* Ambient */}
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
          <div className="w-[120vw] h-[120vw] max-w-[800px] max-h-[800px] bg-violet-900/10 rounded-full blur-[100px] animate-pulse" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-sm space-y-8"
        >
          <div className="text-center space-y-3">
            <div className="mx-auto w-20 h-20 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center mb-6">
              <Fingerprint className="h-10 w-10 text-violet-400" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-widest text-white">
              Acesso <span className="text-violet-400">Restrito</span>
            </h1>
            <p className="text-sm text-slate-400">
              Protocolo de segurança máxima. Identificação requerida.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Credencial VIP
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => { setEmailInput(e.target.value); setError(false); }}
                placeholder="Insira seu e-mail autorizado..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/5 transition-all text-center"
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl flex items-center gap-2"
                >
                  <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                  <span>Acesso Negado. Credencial não reconhecida.</span>
                </motion.div>
              )}
            </AnimatePresence>

            <Button 
              onClick={handleVerify}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest h-14 rounded-2xl gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              <Lock className="h-4 w-4" /> Desbloquear Cofre
            </Button>
          </div>
          
          <p className="text-[9px] text-center text-slate-600 uppercase tracking-widest font-black">
            NEXUS SOVEREIGN PROTOCOL · GOD MODE ENABLED
          </p>
        </motion.div>
      </div>
    );
  }

  // Se estiver autorizado, renderiza a Atena
  return (
    <>
      <Head>
        <link rel="manifest" href="/atena-manifest.json" />
        <meta name="theme-color" content="#020617" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <title>Atena - Nexus</title>
      </Head>
      {children}
    </>
  );
}
