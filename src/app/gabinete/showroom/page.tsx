"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Building2, UserCircle, MessageSquare, Mic, Globe2, Briefcase, Tv, Leaf, LayoutDashboard, X, Play, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, FileText, CheckCircle2, DollarSign, Calendar } from "lucide-react";
import Link from "next/link";

const mainAvatars = [
  { name: "Sofia", file: "Sofia.png", desc: "Embaixadora Digital de Cidades Inteligentes" },
  { name: "Clara", file: "Clara.png", desc: "Consultora de Turismo e Acolhimento" },
  { name: "Helena", file: "Helena.png", desc: "IA Especialista em Gestão Urbana (Smart City)" },
  { name: "Elaine", file: "Elaine.png", desc: "Embaixadora do Litoral e Eventos" },
  { name: "Ingrid", file: "Ingrid.png", desc: "Agente de Desburocratização e Alvarás" },
  { name: "Marina", file: "Marina.png", desc: "Atendimento Bilíngue e Relações Públicas" },
  { name: "Eduarda", file: "Eduarda.png", desc: "Consultora de Negócios Corporativos" },
];

export default function ShowroomPage() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0);
  const nextAvatar = () => {
    setCurrentAvatarIndex((prev) => (prev + 1) % mainAvatars.length);
  };

  const prevAvatar = () => {
    setCurrentAvatarIndex((prev) => (prev - 1 + mainAvatars.length) % mainAvatars.length);
  };

  const currentAvatar = mainAvatars[currentAvatarIndex];

  return (
    <div className="min-h-screen bg-[#080b10] text-slate-200 pt-24 pb-20 px-4 relative">
      {/* BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/40 via-[#020617]/80 to-[#020617]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.05)_0%,transparent_60%)]" />
      </div>

      {/* VIDEO MODAL */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={() => setActiveVideo(null)}
                className="w-10 h-10 bg-black/50 hover:bg-red-500/80 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Informativo de Demonstração */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <div className="bg-black/70 backdrop-blur-md border border-slate-700 text-slate-300 px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                Material Demonstrativo: Campanhas Nexus
              </div>
            </div>

            <div className="aspect-video w-full bg-black relative">
              <video 
                src={activeVideo} 
                controls 
                autoPlay 
                className="w-full h-full object-contain"
              >
                Seu navegador não suporta a reprodução de vídeos.
              </video>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 border-b border-slate-800 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-900/20 border border-blue-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)]">
              <Sparkles className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-headline text-white tracking-wide">Showroom de Avatares</h1>
              <p className="text-slate-400">Cardápio de Inteligência Artificial Especializada</p>
            </div>
          </div>
          
          <Link href="/gabinete" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 px-4 py-2 rounded-full cursor-pointer text-sm font-medium">
            <LayoutDashboard className="w-4 h-4" />
            Voltar ao Gabinete
          </Link>
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Featured Avatar (Carousel) */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 relative overflow-hidden h-full flex flex-col justify-between group">
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl transition-colors duration-500" />
              
              {/* Featured Badge */}
              <div className="absolute top-6 right-6 z-20">
                <div className="bg-blue-500/20 border border-blue-500/50 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  GovTech Model
                </div>
              </div>

              <div className="relative z-10 flex-1 flex flex-col md:flex-row gap-8 items-center md:items-start">
                
                {/* Image Carousel Frame */}
                <div className="w-64 h-80 bg-slate-800/80 rounded-xl border border-slate-700 overflow-hidden shadow-2xl relative flex-shrink-0 group-hover:border-blue-500/50 transition-colors flex items-center justify-center">
                   
                   {/* Botão Anterior */}
                   <button 
                     onClick={prevAvatar}
                     className="absolute left-2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-blue-600 text-white flex items-center justify-center transition-colors backdrop-blur-sm border border-slate-600"
                   >
                     <ChevronLeft className="w-5 h-5" />
                   </button>

                   {/* Botão Próximo */}
                   <button 
                     onClick={nextAvatar}
                     className="absolute right-2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-blue-600 text-white flex items-center justify-center transition-colors backdrop-blur-sm border border-slate-600"
                   >
                     <ChevronRight className="w-5 h-5" />
                   </button>

                   <UserCircle className="w-32 h-32 text-slate-600 opacity-50 absolute" />
                   
                   <Image 
                     key={currentAvatar.file} // Key forces re-render/animation
                     src={`/avatars/Imagens/${currentAvatar.file}`} 
                     alt={`Embaixadora ${currentAvatar.name}`}
                     fill 
                     className="object-cover relative z-0 animate-in fade-in duration-500"
                     onError={(e) => { e.currentTarget.style.display = 'none'; }}
                   />

                   {/* Contagem */}
                   <div className="absolute bottom-2 right-3 z-20 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-[10px] text-slate-300 font-mono">
                     {currentAvatarIndex + 1} / {mainAvatars.length}
                   </div>
                </div>

                {/* Info Panel */}
                <div className="flex flex-col flex-1">
                  <h2 className="text-5xl font-bold font-headline text-white mb-2 transition-all duration-300">
                    {currentAvatar.name} <span className="text-blue-500 text-2xl font-light">| IA</span>
                  </h2>
                  <p className="text-xl text-slate-400 mb-6 font-light transition-all duration-300">
                    {currentAvatar.desc}
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <FeatureItem icon={<Globe2 />} title="Atendimento Poliglota 24/7" desc="Fluência nativa em mais de 50 idiomas para turistas e investidores globais." />
                    <FeatureItem icon={<Building2 />} title="Balcão Cidadão" desc="Resolução ágil sobre IPTU, Alvarás e serviços públicos." />
                    <FeatureItem icon={<MessageSquare />} title="Triagem Humanizada" desc="Empatia e clareza no filtro de denúncias e ouvidoria." />
                  </div>
                  
                  <button className="mt-auto bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest text-sm py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]">
                    Iniciar Simulação de Atendimento
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Other AI Experts Grid */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-slate-700" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">IAs Especialistas (Corporativo)</h3>
              <div className="flex-1 h-[1px] bg-slate-700" />
            </div>

            <div className="grid grid-cols-2 gap-4 h-full">
              
              {/* Aurora */}
              <AICard 
                name="Aurora" 
                role="Mídia & Psicologia" 
                icon={<Tv className="w-5 h-5 text-amber-400" />} 
                color="amber"
                imagePath="/avatars/Imagens/aurora.png"
                videoPath="/avatars/Vídeos/Aurora_-_Estudante_de_psicologia..mp4"
                onPlay={() => setActiveVideo("/avatars/Vídeos/Aurora_-_Estudante_de_psicologia..mp4")}
              />
              
              {/* Magadot */}
              <AICard 
                name="Magadot" 
                role="IA Executiva" 
                icon={<Leaf className="w-5 h-5 text-emerald-400" />} 
                color="emerald"
                imagePath="/avatars/Imagens/magadot.png" // Fallback caso não tenha
                videoPath="/avatars/Vídeos/Magadot_Nexus.mp4"
                onPlay={() => setActiveVideo("/avatars/Vídeos/Magadot_Nexus.mp4")}
              />
              
              {/* Djeny */}
              <AICard 
                name="Djeny" 
                role="IA B2B" 
                icon={<LayoutDashboard className="w-5 h-5 text-purple-400" />} 
                color="purple"
                imagePath="/avatars/Imagens/djeny.png" // Fallback
                videoPath="/avatars/Vídeos/Nexus_B2B.mp4" // Placeholder usando o Nexus_B2B
                onPlay={() => setActiveVideo("/avatars/Vídeos/Nexus_B2B.mp4")}
              />
              
              {/* Isadora */}
              <AICard 
                name="Isadora" 
                role="Vendas" 
                icon={<Briefcase className="w-5 h-5 text-rose-400" />} 
                color="rose"
                imagePath="/avatars/Imagens/isadora.png" // Fallback
                videoPath="/avatars/Vídeos/Isadora_-_Executiva_em_vendas_Nexus_holding_Group.mp4"
                onPlay={() => setActiveVideo("/avatars/Vídeos/Isadora_-_Executiva_em_vendas_Nexus_holding_Group.mp4")}
              />

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-white font-bold text-sm">{title}</h4>
        <p className="text-slate-400 text-xs mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function AICard({ name, role, icon, color, imagePath, videoPath, onPlay }: { name: string, role: string, icon: React.ReactNode, color: string, imagePath: string, videoPath: string, onPlay: () => void }) {
  
  const colorMap: Record<string, string> = {
    amber: "border-amber-500/30 hover:border-amber-500 bg-amber-950/20 hover:bg-amber-900/30",
    emerald: "border-emerald-500/30 hover:border-emerald-500 bg-emerald-950/20 hover:bg-emerald-900/30",
    purple: "border-purple-500/30 hover:border-purple-500 bg-purple-950/20 hover:bg-purple-900/30",
    rose: "border-rose-500/30 hover:border-rose-500 bg-rose-950/20 hover:bg-rose-900/30",
  };

  const textMap: Record<string, string> = {
    amber: "text-amber-400",
    emerald: "text-emerald-400",
    purple: "text-purple-400",
    rose: "text-rose-400",
  };

  return (
    <div 
      onClick={onPlay}
      className={`relative rounded-xl border p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group overflow-hidden shadow-lg ${colorMap[color]}`}
    >
      
      {/* Image Background */}
      <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity flex items-center justify-center bg-black">
         <Image 
           src={imagePath} 
           alt={name} 
           fill 
           className="object-cover"
           onError={(e) => { e.currentTarget.style.display = 'none'; }}
         />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
          {icon}
        </div>
        <h3 className="text-white font-bold text-lg font-headline">{name}</h3>
        <p className={`text-[10px] uppercase tracking-widest font-bold mt-1 ${textMap[color]}`}>{role}</p>
        
        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)] transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
          <Play className="w-3 h-3 fill-white" />
          Ouvir Demo
        </div>
      </div>
    </div>
  );
}
