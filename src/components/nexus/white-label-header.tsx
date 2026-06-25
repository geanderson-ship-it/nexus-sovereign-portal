'use client';

import React, { useState, useEffect } from 'react';
import { Settings, RefreshCw, Save, Upload, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface WhiteLabelHeaderProps {
  defaultTitle: string;
  defaultSlogan: string;
  defaultLogo: string; // URL path like "/logo-nexus-shield.png"
  storageKeyPrefix: string; // 'energia', 'empresas', 'pactum', 'egide'
  themeColor?: 'amber' | 'blue' | 'violet' | 'rose' | 'emerald';
}

export function WhiteLabelHeader({
  defaultTitle,
  defaultSlogan,
  defaultLogo,
  storageKeyPrefix,
  themeColor = 'blue'
}: WhiteLabelHeaderProps) {
  const [logo, setLogo] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slogan, setSlogan] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Temporary state for form fields
  const [inputTitle, setInputTitle] = useState('');
  const [inputSlogan, setInputSlogan] = useState('');
  const [inputLogo, setInputLogo] = useState<string | null>(null);

  // Theme color maps
  const colorMap = {
    amber: {
      text: 'text-amber-400',
      gradient: 'from-amber-300 via-amber-500 to-orange-600',
      border: 'border-amber-500/20',
      bgGlow: 'bg-amber-500/5',
      button: 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20',
      tag: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    blue: {
      text: 'text-blue-400',
      gradient: 'from-blue-300 via-blue-500 to-indigo-600',
      border: 'border-blue-500/20',
      bgGlow: 'bg-blue-500/5',
      button: 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20',
      tag: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    violet: {
      text: 'text-violet-400',
      gradient: 'from-violet-300 via-violet-500 to-purple-600',
      border: 'border-violet-500/20',
      bgGlow: 'bg-violet-500/5',
      button: 'bg-violet-600 hover:bg-violet-500 shadow-violet-600/20',
      tag: 'bg-violet-500/10 text-violet-400 border-violet-500/20'
    },
    rose: {
      text: 'text-rose-400',
      gradient: 'from-rose-300 via-rose-500 to-red-600',
      border: 'border-rose-500/20',
      bgGlow: 'bg-rose-500/5',
      button: 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20',
      tag: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    },
    emerald: {
      text: 'text-emerald-400',
      gradient: 'from-emerald-300 via-emerald-500 to-teal-600',
      border: 'border-emerald-500/20',
      bgGlow: 'bg-emerald-500/5',
      button: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20',
      tag: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    }
  };

  const currentTheme = colorMap[themeColor];

  useEffect(() => {
    // Load from localStorage
    const savedLogo = localStorage.getItem(`nexus_custom_logo_${storageKeyPrefix}`);
    const savedTitle = localStorage.getItem(`nexus_custom_title_${storageKeyPrefix}`);
    const savedSlogan = localStorage.getItem(`nexus_custom_slogan_${storageKeyPrefix}`);

    setLogo(savedLogo || null);
    setTitle(savedTitle || defaultTitle);
    setSlogan(savedSlogan || defaultSlogan);

    // Sync form inputs
    setInputLogo(savedLogo || null);
    setInputTitle(savedTitle || defaultTitle);
    setInputSlogan(savedSlogan || defaultSlogan);
  }, [defaultTitle, defaultSlogan, storageKeyPrefix]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image(); // Use window.Image to avoid conflict with next/image if imported later
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 800; // max dimension to ensure quality but keep size low
        
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL(file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png', 0.8);
        setInputLogo(compressedBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    try {
      if (inputLogo) {
        localStorage.setItem(`nexus_custom_logo_${storageKeyPrefix}`, inputLogo);
        setLogo(inputLogo);
      } else {
        localStorage.removeItem(`nexus_custom_logo_${storageKeyPrefix}`);
        setLogo(null);
      }

      if (inputTitle.trim()) {
        localStorage.setItem(`nexus_custom_title_${storageKeyPrefix}`, inputTitle.trim());
        setTitle(inputTitle.trim());
      } else {
        localStorage.removeItem(`nexus_custom_title_${storageKeyPrefix}`);
        setTitle(defaultTitle);
      }

      if (inputSlogan.trim()) {
        localStorage.setItem(`nexus_custom_slogan_${storageKeyPrefix}`, inputSlogan.trim());
        setSlogan(inputSlogan.trim());
      } else {
        localStorage.removeItem(`nexus_custom_slogan_${storageKeyPrefix}`);
        setSlogan(defaultSlogan);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Storage error:", error);
      toast({
        title: "Erro ao salvar",
        description: "A imagem pode ser muito grande ou o armazenamento local está cheio. Tente uma imagem menor.",
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    localStorage.removeItem(`nexus_custom_logo_${storageKeyPrefix}`);
    localStorage.removeItem(`nexus_custom_title_${storageKeyPrefix}`);
    localStorage.removeItem(`nexus_custom_slogan_${storageKeyPrefix}`);

    setLogo(null);
    setTitle(defaultTitle);
    setSlogan(defaultSlogan);

    setInputLogo(null);
    setInputTitle(defaultTitle);
    setInputSlogan(defaultSlogan);

    setIsEditing(false);
  };

  return (
    <div className="w-full relative flex flex-col items-center">
      {/* Settings Edit Button */}
      <div className="absolute right-0 top-0 z-20">
        <Button
          onClick={() => setIsEditing(true)}
          className={`bg-slate-900/60 border hover:bg-slate-900 ${currentTheme.border} ${currentTheme.text} rounded-full h-8 px-3 text-[10px] font-bold uppercase tracking-widest gap-1`}
        >
          <Settings className="w-3.5 h-3.5" /> Personalizar Marca
        </Button>
      </div>

      {/* Main Header Presentation */}
      <div className="flex flex-col items-center text-center gap-6 mt-12 w-full max-w-4xl px-4">
        {/* LOGO */}
        <div className="relative w-full max-w-[900px] h-[400px] md:h-[550px] flex items-center justify-center">
          {logo ? (
            <img
              src={logo}
              alt="Custom Client Logo"
              className="max-w-full max-h-full object-contain rounded-[40px] shadow-[0_0_80px_rgba(255,255,255,0.12)]"
            />
          ) : (
            <div className={`w-full h-full rounded-[40px] flex items-center justify-center border ${currentTheme.border} ${currentTheme.bgGlow} shadow-[0_0_80px_rgba(255,255,255,0.06)]`}>
              <img
                src={defaultLogo}
                alt="Nexus Logo Shield"
                className="w-full h-full object-contain filter brightness-110 p-8 md:p-16"
              />
            </div>
          )}
        </div>

        {/* NOME DA EMPRESA */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white">
          {title.split(' ').map((word, i) => {
            // highlight the last word or keep normal
            if (i === title.split(' ').length - 1 && title.split(' ').length > 1) {
              return (
                <span key={i} className={`text-transparent bg-clip-text bg-gradient-to-br ${currentTheme.gradient}`}>
                  {' '}{word}
                </span>
              );
            }
            return i === 0 ? word : ` ${word}`;
          })}
        </h1>

        {/* SLOGAN */}
        <p className="text-zinc-400 text-sm sm:text-base md:text-xl font-light tracking-wide max-w-2xl leading-relaxed">
          {slogan}
        </p>
      </div>

      {/* Settings Modal (Custom Overlay to avoid dependency errors) */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-slate-800 rounded-3xl w-full max-w-md p-6 text-slate-200 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-800">
              <Sparkles className={`w-5 h-5 ${currentTheme.text}`} />
              <h3 className="text-sm font-headline font-bold text-white uppercase tracking-widest">Configuração White-Label</h3>
            </div>

            {/* Form */}
            <div className="space-y-4 text-xs">
              {/* Upload Logo */}
              <div className="space-y-2">
                <Label className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Logo da Empresa</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl border border-slate-800 bg-black/30 flex items-center justify-center overflow-hidden shrink-0">
                    {inputLogo ? (
                      <img src={inputLogo} alt="Preview" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-slate-500">Sem Logo</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:bg-slate-900 transition-colors ${currentTheme.border} ${currentTheme.text}`}>
                      <Upload className="w-3.5 h-3.5" /> Enviar Logo PNG/JPG
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[9px] text-slate-500">Ideal: Fundo transparente, proporções quadradas ou horizontais.</p>
                  </div>
                </div>
              </div>

              {/* Company Name */}
              <div className="space-y-1.5">
                <Label htmlFor="wl-title" className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Nome da Empresa / Solução</Label>
                <Input
                  id="wl-title"
                  value={inputTitle}
                  onChange={(e) => setInputTitle(e.target.value)}
                  placeholder={defaultTitle}
                  className="bg-black/50 border-slate-800 text-xs h-9 text-white focus-visible:ring-emerald-500"
                />
              </div>

              {/* Slogan */}
              <div className="space-y-1.5">
                <Label htmlFor="wl-slogan" className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Slogan da Empresa / Solução</Label>
                <Input
                  id="wl-slogan"
                  value={inputSlogan}
                  onChange={(e) => setInputSlogan(e.target.value)}
                  placeholder={defaultSlogan}
                  className="bg-black/50 border-slate-800 text-xs h-9 text-white focus-visible:ring-emerald-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-800">
              <Button
                onClick={handleReset}
                variant="ghost"
                className="text-slate-400 hover:text-white text-[10px] font-bold uppercase tracking-wider h-8 gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Resetar Padrão
              </Button>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white text-[10px] font-bold uppercase tracking-wider h-8"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  className={`text-white text-[10px] font-bold uppercase tracking-wider h-8 gap-1 ${currentTheme.button}`}
                >
                  <Save className="w-3 h-3" /> Salvar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
