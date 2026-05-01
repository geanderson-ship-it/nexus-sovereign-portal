'use client';

import { MessageSquare, X, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from '@/hooks/use-locale';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function FloatingSupport() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const pathname = usePathname();
  const { t } = useLocale();

  useEffect(() => {
    // Mostrar após 3 segundos
    const timer = setTimeout(() => setIsVisible(true), 3000);
    // Mostrar tooltip após 8 segundos
    const tooltipTimer = setTimeout(() => setShowTooltip(true), 8000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(tooltipTimer);
    };
  }, []);

  const router = useRouter();

  const handleWhatsApp = () => {
    const rawMessage = t('floatingSupport.message').replace('{{pathname}}', pathname || '');
    const message = encodeURIComponent(rawMessage);
    window.open(`https://wa.me/5551999799582?text=${message}`, '_blank');
  };

  const handleEmail = () => {
    router.push('/contact');
  };

  const isGabinete = pathname?.startsWith('/gabinete');

  if (!isVisible || isGabinete) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* High Demand Notice - Fixed and Automatic */}
      <div className="bg-[#0A0A0A]/90 backdrop-blur-md border border-white/10 text-white p-3 rounded-xl shadow-2xl text-[10px] uppercase tracking-wider mb-1 max-w-[200px] border-l-4 border-[#0057FF]">
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </span>
          <span className="font-bold text-red-500">{t('floatingSupport.highDemand').split(':')[0]}</span>
        </div>
        <p className="opacity-80 leading-relaxed">
          {t('floatingSupport.highDemand').split(':').slice(1).join(':').trim()}
        </p>
      </div>

      {showTooltip && (
        <div className="bg-white text-black p-3 rounded-xl shadow-2xl text-xs font-bold mb-1 relative animate-bounce max-w-[200px]">
          <button 
            onClick={() => setShowTooltip(false)}
            className="absolute -top-1 -right-1 bg-black text-white rounded-full p-0.5"
          >
            <X size={10} />
          </button>
          {t('floatingSupport.tooltip')}
        </div>
      )}

      {/* Email Button - Executive Nexus Blue & Brushed Steel */}
      <button
        onClick={handleEmail}
        className={cn(
          "w-16 h-16 rounded-full shadow-[0_0_25px_rgba(0,87,255,0.4)] transition-all duration-300 hover:scale-110 flex items-center justify-center relative overflow-hidden bg-[#0057FF] border border-white/20 group",
        )}
      >
        {/* Brushed Steel Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        <div className="relative flex flex-col items-center justify-center text-white">
          <Mail size={24} className="mb-0.5 text-slate-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          <span className="text-[7px] font-black uppercase text-center leading-none tracking-tighter text-slate-300">
            {t('floatingSupport.consultantLabel').split(' ').map((word: string, i: number) => (
               <div key={i}>{word}</div>
            ))}
          </span>
        </div>
      </button>

      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsApp}
        className={cn(
          "w-16 h-16 rounded-full shadow-[0_0_20px_rgba(255,191,0,0.4)] transition-all duration-300 hover:scale-110 group relative p-0 overflow-hidden",
          "btn-glow-pulse"
        )}
      >
        <Image 
            src="https://i.postimg.cc/zGWgJTD8/Botao-amarelo-Whats-App.png" 
            alt="WhatsApp Suporte" 
            fill 
            className="object-contain"
        />
        <span className="absolute top-1 right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
      </button>
    </div>
  );
}
