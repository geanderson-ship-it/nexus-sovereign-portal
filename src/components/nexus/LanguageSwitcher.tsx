'use client';

import React, { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState('pt');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLocale = localStorage.getItem("locale");
      if (storedLocale) {
        const langCodeMap: Record<string, string> = {
          'pt-BR': 'pt',
          'en-US': 'en',
          'es-ES': 'es',
          'fr-FR': 'fr',
          'de-DE': 'de',
          'zh-CN': 'zh-CN',
          'ar-AE': 'ar'
        };
        const shortLang = langCodeMap[storedLocale] || 'pt';
        setCurrentLang(shortLang);
      }
    }
  }, []);
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    const domain = window.location.hostname;
    
    // Set standard path cookie (works everywhere, including localhost)
    document.cookie = `googtrans=/pt/${lang}; path=/`;
    
    // Set domain cookie only if it's a valid production domain with dots and not localhost
    if (domain.includes('.') && !domain.includes('localhost')) {
      document.cookie = `googtrans=/pt/${lang}; path=/; domain=.${domain}`;
    }
    
    // Sync the local locale provider key as well
    const localeMapReverse: Record<string, string> = {
      'pt': 'pt-BR',
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'zh-CN': 'zh-CN',
      'ar': 'ar-AE'
    };
    const newLocale = localeMapReverse[lang] || 'pt-BR';
    localStorage.setItem("locale", newLocale);

    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 left-4 z-[9999] pointer-events-auto flex items-center gap-2 bg-zinc-950/80 backdrop-blur-md border border-violet-500/30 p-2 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all group">
      <Globe className="h-4 w-4 text-violet-500 group-hover:text-violet-400 transition-colors" />
      
      <select 
        value={currentLang}
        onChange={handleLanguageChange}
        className="bg-transparent text-violet-400 font-black uppercase tracking-widest text-[10px] outline-none cursor-pointer appearance-none pr-4"
      >
        <option value="pt" className="bg-zinc-900 text-white">PT</option>
        <option value="en" className="bg-zinc-900 text-white">EN</option>
        <option value="es" className="bg-zinc-900 text-white">ES</option>
        <option value="fr" className="bg-zinc-900 text-white">FR</option>
        <option value="de" className="bg-zinc-900 text-white">DE</option>
        <option value="zh-CN" className="bg-zinc-900 text-white">ZH</option>
        <option value="ar" className="bg-zinc-900 text-white">AR</option>
      </select>
    </div>
  );
}
