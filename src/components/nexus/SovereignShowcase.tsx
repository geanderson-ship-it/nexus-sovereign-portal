'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Eye, Lock, Phone, HelpCircle, CheckCircle, RefreshCw, Sprout, Users, Landmark, Camera, Database, WifiOff, Volume2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface SovereignShowcaseProps {
  moduleName: string;
  imagePath: string;
  children: React.ReactNode;
  whatsappUrl?: string;
  whatsappMessage?: string;
}

export function SovereignShowcase({
  moduleName,
  imagePath,
  children,
  whatsappUrl = 'https://wa.me/5551999799582',
  whatsappMessage
}: SovereignShowcaseProps) {
  const { user } = useUser();
  const isAdmin = isAdminUser(user);
  
  // State to toggle visual demo mode vs interactive mode for Admin only
  const [showDemoOnly, setShowDemoOnly] = useState(true);

  // Default whatsapp link message if none provided
  const finalMessage = whatsappMessage || `Olá! Gostaria de agendar uma demonstração privada do Módulo ${moduleName} e obter informações sobre o Licenciamento Corporativo Soberano.`;
  const finalWhatsappLink = `${whatsappUrl}?text=${encodeURIComponent(finalMessage)}`;

  // Set default view: clients only see demo, admins can toggle but start with interactive view
  useEffect(() => {
    if (isAdmin) {
      setShowDemoOnly(false);
    } else {
      setShowDemoOnly(true);
    }
  }, [isAdmin]);

  // If user is Admin and toggles to interactive, or if we want interactive
  if (!showDemoOnly) {
    return (
      <div className="relative">
        {children}
      </div>
    );
  }

  // Showcase view (Client view or Admin simulation)
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 space-y-8 relative overflow-hidden flex flex-col justify-between">
      
      {/* AMBIENT GLOWS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
      </div>

      <div className="relative z-10 space-y-6 flex-1 flex flex-col">
        {/* SOVEREIGN SHOWROOM HUD HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[32px] bg-slate-900/40 backdrop-blur-xl border border-white/5 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <Shield className="h-6 w-6 text-blue-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight font-headline italic">
                  {moduleName}
                </h1>
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[8px] font-black tracking-widest uppercase">
                  DEMO_VITRINE
                </Badge>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                Visualização de Alta Fidelidade • Licenciamento Corporativo Requerido
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button 
                onClick={() => setShowDemoOnly(false)}
                className="bg-amber-600/10 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 font-black text-[9px] uppercase tracking-widest h-10 px-4 rounded-xl"
              >
                Ativar Painel Interativo
              </Button>
            )}
            <Button asChild variant="ghost" className="text-slate-500 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl px-5 h-10 text-xs font-black uppercase tracking-widest">
              <Link href="/intelligence">Voltar ao Hub</Link>
            </Button>
          </div>
        </div>

        {/* NOTIFICATION BOX */}
        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 backdrop-blur-md flex items-center gap-3 max-w-4xl mx-auto w-full">
          <Lock className="h-4 w-4 text-blue-400 shrink-0" />
          <p className="text-xs text-slate-400 font-medium">
            Você está no **Showroom Soberano**. Para garantir a segurança dos dados e conformidade comercial, o painel de edição está bloqueado. Veja abaixo os relatórios e inteligências em tempo real gerados na conta demonstrativa ativa.
          </p>
        </div>

        {/* SCREENSHOT WORKSPACE MONITOR FRAME */}
        <div className="flex-1 flex items-center justify-center p-2 md:p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative w-full max-w-7xl aspect-[16/9] rounded-[40px] overflow-hidden border-2 border-white/10 bg-slate-950 shadow-[0_0_80px_rgba(0,0,0,0.8)] group"
          >
            {/* Monitor Glass Reflections */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.02] to-white/0 pointer-events-none z-20" />
            
            {/* Holographic Watermark overlay */}
            <div className="absolute inset-0 bg-radial-gradient z-10 pointer-events-none flex items-center justify-center select-none opacity-20">
              <div className="text-center rotate-[-12deg] tracking-[0.4em] font-black uppercase text-slate-500 text-3xl sm:text-5xl md:text-7xl font-headline opacity-10">
                NEXUS SOVEREIGN
              </div>
            </div>

            {/* High-fidelity static screenshot image */}
            <Image 
              src={imagePath} 
              alt={`${moduleName} Screenshot Showcase`}
              fill
              className="object-cover md:object-contain transition-transform duration-[4s] group-hover:scale-102"
              priority
            />

            {/* Glassmorphic Non-Editable Indicator Badge */}
            <div className="absolute top-6 right-6 z-20 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">
                Modo Somente Leitura (Vitrine)
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Three profiles for Dante Safra Showcase */}
      {moduleName === 'Dante Safra' && (
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 mt-2">
          <div className="text-center mb-6">
            <h3 className="text-base font-bold font-headline uppercase tracking-widest text-emerald-400">
              Perfis de Atuação e Soluções
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Conheça as três vertentes táticas do módulo Dante Safra desenvolvidas para o agronegócio.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/40 border border-emerald-900/20 backdrop-blur-xl p-5 rounded-2xl flex flex-col items-start text-left">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 self-center md:self-start">
                <Sprout className="h-6 w-6 text-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-white mt-3 font-headline uppercase tracking-wider self-center md:self-start">Agricultor</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest -mt-0.5 self-center md:self-start">Produtor de Precisão</p>
              <p className="text-xs text-slate-300 mt-3 font-semibold leading-relaxed">
                "O Dante Safra cuida da sua propriedade de A a Z. Da semente na terra ao dinheiro no bolso."
              </p>
              <ul className="text-[11px] text-slate-400 mt-3 space-y-2 leading-relaxed">
                <li>🌱 <strong>Qualquer Cultura:</strong> Grãos, fumo, hortaliças, frutas ou pastagem.</li>
                <li>🩺 <strong>Médico da Lavoura:</strong> Diagnostica doenças foliares e pragas.</li>
                <li>🐷 <strong>Olho na Criação:</strong> Controla peso, saúde animal e consumo de ração.</li>
              </ul>
            </div>
            <div className="bg-slate-900/40 border border-emerald-900/20 backdrop-blur-xl p-5 rounded-2xl flex flex-col items-start text-left">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 self-center md:self-start">
                <Users className="h-6 w-6 text-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-white mt-3 font-headline uppercase tracking-wider self-center md:self-start">Cooperativa</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest -mt-0.5 self-center md:self-start">Sinergia & Escala</p>
              <p className="text-xs text-slate-300 mt-3 font-semibold leading-relaxed">
                "Garantia de safra cheia e padrão de excelência para os seus associados."
              </p>
              <ul className="text-[11px] text-slate-400 mt-3 space-y-2 leading-relaxed">
                <li>🌾 <strong>Grãos de Primeira:</strong> O produtor entrega o melhor produto no recebimento.</li>
                <li>🛡️ <strong>Escudo Contra Pragas:</strong> Monitoramento regional para proteção de lavouras.</li>
                <li>📈 <strong>Fomento Inteligente:</strong> Planejamento seguro de insumos e financiamentos.</li>
              </ul>
            </div>
            <div className="bg-slate-900/40 border border-emerald-900/20 backdrop-blur-xl p-5 rounded-2xl flex flex-col items-start text-left">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 self-center md:self-start">
                <Landmark className="h-6 w-6 text-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-white mt-3 font-headline uppercase tracking-wider self-center md:self-start">Para o Município</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest -mt-0.5 self-center md:self-start">Prefeituras & Vocação</p>
              <p className="text-xs text-slate-300 mt-3 font-semibold leading-relaxed">
                "Transforme sua cidade no próximo Polo de Tecnologia Agrícola e orgulhe a sua comunidade."
              </p>
              <ul className="text-[11px] text-slate-400 mt-3 space-y-2 leading-relaxed">
                <li>🏆 <strong>Município Destaque:</strong> Cidade no mapa da inovação com projeto pioneiro.</li>
                <li>🎓 <strong>Escola do Futuro:</strong> Capacitação de jovens para manter as famílias no campo.</li>
                <li>💰 <strong>Dinheiro Local:</strong> Aumento de arrecadação do bloco de produtor sem novos impostos.</li>
              </ul>
            </div>
          </div>

          {/* Simulated chat print */}
          <div className="mt-12 bg-slate-950/80 rounded-[32px] border border-emerald-500/20 p-6 md:p-8 space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Demonstração de Uso
              </span>
              <h3 className="text-xl font-bold font-headline uppercase tracking-wider text-white mt-3">
                Simplicidade e Resposta Completa
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Veja um exemplo real de como o Dante Safra resolve um problema de campo em segundos a partir de foto e áudio.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Simulated Phone Chat Screen */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                {/* Phone Header */}
                <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                      <h4 className="text-xs font-bold text-white font-headline">DANTE SAFRA</h4>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Módulo Agronegócio Ativo</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                    <WifiOff className="h-3 w-3 text-amber-500" />
                    <span>MODO OFF-LINE</span>
                  </div>
                </div>

                {/* Chat Message Area */}
                <div className="p-4 space-y-4 max-h-[380px] overflow-y-auto bg-slate-900/60 custom-scrollbar text-xs">
                  {/* User voice & photo input */}
                  <div className="flex items-start gap-2 justify-end">
                    <div className="max-w-[85%] bg-emerald-800/80 rounded-2xl rounded-tr-none p-3 text-white space-y-2 shadow-lg">
                      <div className="flex items-center gap-3 bg-emerald-900/50 p-2 rounded-xl border border-emerald-700/30">
                        <Volume2 className="h-4 w-4 text-emerald-300" />
                        <div className="flex-1 h-1.5 bg-emerald-700/50 rounded-full overflow-hidden relative">
                          <div className="absolute top-0 left-0 w-2/3 h-full bg-emerald-300 rounded-full" />
                        </div>
                        <span className="text-[10px] text-emerald-200">0:08</span>
                      </div>
                      <div className="relative rounded-lg overflow-hidden border border-emerald-700 bg-slate-950 aspect-video">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 flex items-end p-2">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">milho_folha_praga.png</span>
                        </div>
                        <img 
                          src="/Nexus Empresas/Dante safra axis.png" 
                          alt="Folha de milho com lagarta" 
                          className="object-cover w-full h-full opacity-60" 
                        />
                      </div>
                      <p className="leading-relaxed text-[11px]">
                        "Dante, analise essa lagarta que começou a surgir na roça e me dê a recomendação para o solo com pH 5.2."
                      </p>
                    </div>
                  </div>

                  {/* Dante response */}
                  <div className="flex items-start gap-2 justify-start">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <Sprout className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                    <div className="max-w-[85%] bg-slate-800/90 rounded-2xl rounded-tl-none p-4 text-slate-200 space-y-3 shadow-lg border border-slate-700/50">
                      <div className="border-b border-slate-700/50 pb-1.5 flex items-center justify-between">
                        <span className="font-bold text-emerald-400 font-headline">Dante Safra AI</span>
                        <span className="text-[9px] text-slate-500">Agro_RX_4011</span>
                      </div>
                      <div className="space-y-2 text-[11px] leading-relaxed">
                        <p className="font-bold text-white flex items-center gap-1.5">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          1. Diagnóstico de Fitossanidade:
                        </p>
                        <p className="pl-3 text-slate-300">
                          Identificada presença de <strong className="text-white">Spodoptera frugiperda</strong> (Lagarta-do-cartucho) no milho. Recomendado controle imediato para evitar desfolha acentuada no estágio V4.
                        </p>
                        <p className="font-bold text-white flex items-center gap-1.5">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          2. Correção de Solo (pH 5.2):
                        </p>
                        <p className="pl-3 text-slate-300">
                          Solo ácido prejudica a absorção de nitrogênio e fósforo. Recomendada calagem com <strong className="text-white">2.4 toneladas por hectare</strong> de calcário dolomítico (PRNT 85%) para elevar a saturação por bases.
                        </p>
                        <p className="font-bold text-white flex items-center gap-1.5">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          3. Plano de Manejo Sugerido:
                        </p>
                        <p className="pl-3 text-slate-300">
                          • Aplicação de defensivo biológico à base de <em>Bacillus thuringiensis</em>.<br />
                          • Sincronização off-line realizada: receita e dosagem salvas localmente para aplicação em campo.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Explanations of facilidades, simplicidade, completo */}
              <div className="lg:col-span-5 space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 shrink-0">
                    <Camera className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider font-headline text-left">Interação Simples e Natural</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed text-left">
                      Não há necessidade de planilhas complexas. Basta mandar um áudio ou anexar uma foto de folha, praga ou laudo físico direto pela câmera do celular. O Dante entende e analisa em tempo real.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 shrink-0">
                    <Sprout className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider font-headline text-left">O Mais Completo do Mercado</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed text-left">
                      O Dante Safra cobre desde a telemetria do solo e clima regionalizado até diagnósticos de pragas, planos de calagem, cotações de mercado e dosagem científica de insumos.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 shrink-0">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider font-headline text-left">Operação 100% Off-line</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed text-left">
                      Desenvolvido especificamente para a realidade de campo do Sul do Brasil. O Dante sincroniza em cache no navegador e continua respondendo e fornecendo laudos mesmo sem sinal de internet no talhão.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LUXURY FLOATING CTA DOCK */}
      <div className="relative z-10 w-full max-w-4xl mx-auto pt-6 pb-2">
        <div className="p-6 rounded-[32px] bg-slate-900/60 backdrop-blur-2xl border-2 border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.15)] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h4 className="text-lg font-black text-white uppercase tracking-tight italic">
              Adquira o Módulo {moduleName} para Sua Operação
            </h4>
            <p className="text-xs text-slate-400">
              Elimine gargalos com licenciamento perpétuo e suporte corporativo de elite Nexus.
            </p>
          </div>

          <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest px-8 h-12 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-102">
            <a href={finalWhatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Falar com Consultor B2B
            </a>
          </Button>
        </div>
      </div>

    </div>
  );
}
