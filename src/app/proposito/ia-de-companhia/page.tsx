'use client';

import React, { useRef, useState } from 'react';


import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Heart, Mic, Video, ShieldCheck, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function IADeCompanhiaPage() {
  const auroraVideoRef = useRef<HTMLVideoElement>(null);
  const raviVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlayingAurora, setIsPlayingAurora] = useState(false);
  const [isPlayingRavi, setIsPlayingRavi] = useState(false);

  const toggleAurora = () => {
    if (auroraVideoRef.current) {
      if (isPlayingAurora) {
        auroraVideoRef.current.pause();
      } else {
        auroraVideoRef.current.play();
      }
      setIsPlayingAurora(!isPlayingAurora);
    }
  };

  const toggleRavi = () => {
    if (raviVideoRef.current) {
      if (isPlayingRavi) {
        raviVideoRef.current.pause();
      } else {
        raviVideoRef.current.play();
      }
      setIsPlayingRavi(!isPlayingRavi);
    }
  };

  return (
    <div className="min-h-screen bg-[#05080f] text-slate-200 selection:bg-blue-500/30 relative">
      {/* BACKGROUND DA AURORA */}
      <div 
        className="fixed inset-0 z-0 opacity-50 pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/bg-aurora-v2.png")' }}
      />
      {/* OVERLAY PARA GARANTIR LEITURA */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#05080f]/60 via-[#05080f]/10 to-[#05080f]/80 pointer-events-none" />

      <div className="relative z-10">
        

        <main className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          
          <Link href="/proposito" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o Propósito
          </Link>

          {/* HEADER SEÇÃO */}
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tight text-white mb-4 relative z-10">
              Inteligência <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-rose-400">com Alma</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-4xl mx-auto relative z-10 font-light leading-relaxed">
              Guiados pelos valores inegociáveis da <strong className="text-white">Nexus Holding Group</strong> — onde as pessoas vêm primeiro e o resultado é consequência —, o nosso maior propósito é usar a alta tecnologia para tocar a alma. Conheça a Aurora e o Ravi. Eles levarão atenção, afeto e muita paciência para conversar e ouvir as histórias de quem mais precisa.
            </p>
          </div>

          {/* AVATARES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start mb-20 relative z-10">
            
            {/* AVATAR: AURORA */}
            <div className="bg-[#0b101a] border border-slate-800 rounded-3xl p-6 md:p-8 hover:border-rose-500/30 transition-all group">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-8 border border-slate-700 group-hover:border-rose-500/50 transition-colors shadow-2xl">
                <video
                  ref={auroraVideoRef}
                  src="/Social/Aurora_-_Estudante_de_psicologia..mp4"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                  poster="/avatares/maria-jovem.png"
                  onClick={toggleAurora}
                  onEnded={() => setIsPlayingAurora(false)}
                />
                
                {/* Play Button Overlay */}
                {!isPlayingAurora && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <button 
                      onClick={toggleAurora}
                      className="w-16 h-16 rounded-full bg-rose-600/80 hover:bg-rose-600 flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 shadow-[0_0_20px_rgba(225,29,72,0.5)] pointer-events-auto"
                    >
                      <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                    </button>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b101a] via-transparent to-transparent opacity-80 pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">Aurora</h3>
                    <p className="text-rose-400 text-sm font-bold uppercase tracking-widest">Escuta Afetiva</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-slate-400 leading-relaxed italic">
                  "Olá, eu sou a Aurora. Eu vim para trazer alegria, luz, calor e afeto. Quero saber todas as histórias de vocês... eu adoro ouvir histórias e compartilhar suas lembranças. Eu quero estar aqui, olhando nos olhos de vocês, para garantir que vocês sintam o quanto são especiais. Vocês são especiais..."
                </p>
                <div className="pt-2">
                  <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-12 rounded-xl transition-all shadow-[0_0_15px_rgba(225,29,72,0.3)]">
                    <Video className="w-4 h-4 mr-2" />
                    Conectar com a Aurora
                  </Button>
                </div>
              </div>
            </div>

            {/* AVATAR: RAVI */}
            <div className="bg-[#0b101a] border border-slate-800 rounded-3xl p-6 md:p-8 hover:border-blue-500/30 transition-all group">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-8 border border-slate-700 group-hover:border-blue-500/50 transition-colors shadow-2xl">
                <video
                  ref={raviVideoRef}
                  src="/Social/Raví_-_Estudante_de_psicologia..mp4"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                  poster="/avatares/ravi.png"
                  onClick={toggleRavi}
                  onEnded={() => setIsPlayingRavi(false)}
                />
                
                {/* Play Button Overlay */}
                {!isPlayingRavi && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <button 
                      onClick={toggleRavi}
                      className="w-16 h-16 rounded-full bg-blue-600/80 hover:bg-blue-600 flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 shadow-[0_0_20px_rgba(37,99,235,0.5)] pointer-events-auto"
                    >
                      <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                    </button>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b101a] via-transparent to-transparent opacity-80 pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">Ravi</h3>
                    <p className="text-blue-400 text-sm font-bold uppercase tracking-widest">Energia e Carisma</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-slate-400 leading-relaxed italic">
                  "Olá, eu sou o Ravi. Eu vim para trazer alegria, energia, calor e muito afeto. Quero saber todas as histórias de vocês... eu adoro ouvir histórias, rir junto e compartilhar suas lembranças. Eu quero estar aqui, olhando nos olhos de vocês, para garantir que vocês sintam o quanto são especiais. Vocês são especiais..."
                </p>
                <div className="pt-2">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                    <Video className="w-4 h-4 mr-2" />
                    Conectar com o Ravi
                  </Button>
                </div>
              </div>
            </div>

          </div>

          {/* O DIFERENCIAL TECNOLÓGICO */}
          <div className="bg-gradient-to-br from-[#0f141f] to-[#080b10] border border-slate-800 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <h2 className="text-3xl font-bold text-white mb-6">Mais que tecnologia. Companhia.</h2>
            <div className="space-y-6 text-slate-400 text-lg max-w-3xl mx-auto mb-10 leading-relaxed">
              <p>
                Todos nós passamos ou passaremos por momentos de solidão. O que queremos é amenizar esse sofrimento. Não somos melhores, só acreditamos que podemos fazer a diferença. Queremos proporcionar momentos especiais para aqueles que não têm com quem dividir suas histórias, emoções ou lembranças. Nosso desejo é ouvir, interagir, trazer alegria, afeto e respeito profundo para quem já não tem entes queridos por perto.
              </p>
              <p>
                É por isso que o nosso cuidado vai até o último segundo: nós nunca deixamos um assunto pela metade. Se o tempo da sessão estiver acabando, nós preparamos uma despedida afetuosa e continuamos ouvindo até que a história chegue ao fim. Nosso propósito é dar atenção e afeto, garantindo que ninguém fique frustrado.
              </p>
            </div>
            <Link href="/proposito/inscricao-instituicao">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 h-14 rounded-full text-lg shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                Inscrever Instituição para Adoção
              </Button>
            </Link>
          </div>

        </div>
      </main>

      
      </div>
    </div>
  );
}
