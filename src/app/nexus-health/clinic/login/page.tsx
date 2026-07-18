"use client";

import { useState } from "react";
import { Lock, ArrowLeft, ShieldCheck, Activity } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function NexusClinicLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/nexus-health/clinic/admin");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#050a11] text-gray-100 flex overflow-hidden relative items-center justify-center">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] pointer-events-none"></div>
      
      {/* Luzes Laranjas (Estilo Exclusive) no Fundo */}
      <div className="fixed top-[-20%] left-[-10%] w-[800px] h-[800px] bg-orange-500/30 rounded-full blur-[150px] pointer-events-none mix-blend-screen opacity-70 z-0"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen opacity-60 z-0"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="relative z-10 w-full max-w-md p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <Link href="/nexus-health/clinic" className="absolute top-0 left-0 p-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ffaa00] to-[#ff5500] flex items-center justify-center shadow-[0_0_30px_rgba(255,170,0,0.4)] mb-6">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#ffaa00]" />
            Nexus Clinic
          </h1>
          <p className="text-gray-400 text-sm">Acesso Restrito para Especialistas</p>
        </div>

        <div className="bg-[rgba(11,18,30,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#ffaa00] to-transparent opacity-50"></div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Usuário ou CRM</label>
              <div className="relative">
                <input 
                  type="text" 
                  defaultValue="admin"
                  required
                  className="w-full bg-[#00000055] border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ffaa00] focus:ring-1 focus:ring-[#ffaa00]/50 transition-all"
                  placeholder="CRM do Profissional"
                />
                <Lock className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Senha</label>
              <div className="relative">
                <input 
                  type="password" 
                  defaultValue="123456"
                  required
                  className="w-full bg-[#00000055] border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ffaa00] focus:ring-1 focus:ring-[#ffaa00]/50 transition-all"
                  placeholder="••••••••"
                />
                <ShieldCheck className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,170,0,0.2)] ${loading ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#ffaa00] to-[#ff5500] text-white hover:shadow-[0_0_30px_rgba(255,170,0,0.4)]'}`}
              >
                {loading ? (
                  <><div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div> Autenticando...</>
                ) : (
                  "Acessar Plataforma"
                )}
              </button>
            </div>
          </form>
        </div>
        
        <p className="text-center text-xs text-gray-600 mt-8">
          Módulo Integrado Administrativo & CRM &copy; 2026
        </p>
      </motion.div>
    </div>
  );
}
