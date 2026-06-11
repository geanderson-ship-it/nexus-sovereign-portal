'use client';

import React, { useEffect } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    
    // Find the hidden Google Translate select box
    const googleSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    
    if (googleSelect) {
      googleSelect.value = lang;
      // Trigger the change event so Google knows to translate
      googleSelect.dispatchEvent(new Event('change'));
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-[9999] pointer-events-auto flex items-center gap-2 bg-zinc-950/80 backdrop-blur-md border border-violet-500/30 p-2 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all group">
      <Globe className="h-4 w-4 text-violet-500 group-hover:text-violet-400 transition-colors" />
      
      <select 
        onChange={handleLanguageChange}
        className="bg-transparent text-violet-400 font-black uppercase tracking-widest text-[10px] outline-none cursor-pointer appearance-none pr-4"
        defaultValue="pt"
      >
        <option value="pt" className="bg-zinc-900 text-white">PT</option>
        <option value="en" className="bg-zinc-900 text-white">EN</option>
        <option value="es" className="bg-zinc-900 text-white">ES</option>
        <option value="fr" className="bg-zinc-900 text-white">FR</option>
        <option value="de" className="bg-zinc-900 text-white">DE</option>
        <option value="zh-CN" className="bg-zinc-900 text-white">ZH</option>
      </select>

      {/* Escondendo a setinha feia nativa do select e colocando uma customizada via CSS seria o ideal, mas appearance-none + pr-4 já ajuda */}
    </div>
  );
}
