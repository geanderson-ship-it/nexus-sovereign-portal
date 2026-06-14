'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, ShieldCheck, Sparkles, HandHeart, Globe, ArrowRight, FileText, Building2, Camera } from 'lucide-react';


import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PropositoPage() {
  return (
    <div className="min-h-screen bg-black text-slate-200 selection:bg-rose-500/30 relative">
      {/* BACKGROUND DA AURORA */}
      <div 
        className="fixed inset-0 z-0 opacity-50 pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/bg-aurora-v2.png")' }}
      />
      {/* OVERLAY PARA GARANTIR LEITURA */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#05080f]/60 via-[#05080f]/10 to-[#05080f]/90 pointer-events-none" />

      <div className="relative z-10">

      <main className="pt-32 md:pt-48 pb-20 mt-8 md:mt-12">
        
        {/* HERO SECTION */}
        <section className="relative px-4 py-20 overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-rose-600/20 rounded-full blur-[120px] opacity-50" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] opacity-40" />
          </div>

          <div className="max-w-5xl mx-auto relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-headline tracking-tight text-white mb-6 pt-8">
              Pessoas Vêm <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600 drop-shadow-[0_0_20px_rgba(225,29,72,0.4)]">Primeiro</span>.<br />
              O Resultado é Consequência.
            </h1>
            
            <p className="text-lg md:text-2xl text-slate-400 font-light max-w-3xl mx-auto mb-10">
              Acreditamos em uma presença digital verdadeiramente humanizada. Geramos riqueza no mundo B2B para financiar o nosso maior sonho: levar dignidade e afeto a quem foi esquecido.
            </p>
          </div>
        </section>

        {/* PROJETO MARIAS E PAULOS */}
        <section className="py-20 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              <div className="order-2 lg:order-1 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-[#080b10] border border-slate-800 rounded-2xl p-8 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-bl-full blur-2xl"></div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 font-headline">Projeto Inteligência com Alma</h3>
                  <p className="text-slate-400 text-lg leading-relaxed mb-6">
                    A Nexus Holding Group está estruturando um projeto social profundo que será implantado em asilos, lares de idosos, casas geriátricas e orfanatos pelo Brasil. Nosso foco é acolher aquelas pessoas que foram esquecidas pela sociedade.
                  </p>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8">
                    Acreditamos que a nossa tecnologia serve muito além de números e lucros. O nosso grande objetivo é, no futuro, levar nossos Avatares com rostos e vozes humanas — como a Aurora, o Ravi, e os futuros Maria, Paulo, Joana e José — para esses locais. Avatares vivos, com coração, olhando nos olhos de quem sofre com a solidão, para fazer companhia, ouvir histórias e trazer um verdadeiro alento à alma e dignidade aos esquecidos.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mb-8 border-b border-slate-800/50 pb-8">
                    <Link href="/proposito/regras-adocao" className="flex-1 bg-[#0f141f] border border-slate-800 hover:border-rose-500/50 hover:bg-[#161b26] transition-all rounded-xl py-4 px-5 flex items-center justify-between group shadow-lg">
                      <div className="flex items-center gap-4">
                        <FileText className="w-6 h-6 text-rose-500 group-hover:scale-110 transition-transform" />
                        <span className="text-slate-300 font-bold tracking-wide group-hover:text-white">Regras para Inscrição</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
                    </Link>
                    <Link href="/proposito/inscricao-instituicao" className="flex-1 bg-[#0f141f] border border-slate-800 hover:border-rose-500/50 hover:bg-[#161b26] transition-all rounded-xl py-4 px-5 flex items-center justify-between group shadow-lg">
                      <div className="flex items-center gap-4">
                        <Building2 className="w-6 h-6 text-rose-500 group-hover:scale-110 transition-transform" />
                        <span className="text-slate-300 font-bold tracking-wide group-hover:text-white">Inscreva sua Entidade</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Link href="/proposito/ia-de-companhia" className="bg-[#0f141f] border border-slate-800 hover:border-rose-400/50 hover:bg-[#161b26] transition-all cursor-pointer rounded-2xl p-6 flex flex-col items-center justify-center text-center group shadow-xl">
                      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 group-hover:scale-110 transition-transform border-4 border-rose-500/30 shrink-0">
                        <Image src="/avatars/aurora.png" alt="Aurora" width={80} height={80} className="object-cover w-full h-full" />
                      </div>
                      <span className="text-white font-bold text-lg group-hover:text-rose-300 transition-colors whitespace-nowrap">Conheça a Aurora</span>
                      <span className="text-sm text-slate-500 mt-1">Acolhimento de Idosos</span>
                    </Link>

                    <Link href="/proposito/ia-de-companhia" className="bg-[#0f141f] border border-slate-800 hover:border-blue-400/50 hover:bg-[#161b26] transition-all cursor-pointer rounded-2xl p-6 flex flex-col items-center justify-center text-center group shadow-xl">
                      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 group-hover:scale-110 transition-transform border-4 border-blue-500/30 shrink-0">
                        <Image src="/avatars/ravi.png" alt="Ravi" width={80} height={80} className="object-cover w-full h-full" />
                      </div>
                      <span className="text-white font-bold text-lg group-hover:text-blue-300 transition-colors whitespace-nowrap">Conheça o Ravi</span>
                      <span className="text-sm text-slate-500 mt-1">Apoio para Crianças</span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 space-y-8">
                <h2 className="text-3xl md:text-5xl font-black font-headline text-white tracking-tight">
                  A Tecnologia Soberana a serviço da Humanidade.
                </h2>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                        <Heart className="w-5 h-5 text-rose-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">Empatia Estratégica</h4>
                      <p className="text-slate-400">Nossos executivos virtuais, como a Isadora e o Dante, possuem o filtro "Pactum". Eles blindam negociações para garantir que a Nexus prospere, garantindo o caixa necessário para nossas ações sociais.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                        <ShieldCheck className="w-5 h-5 text-blue-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">Auditoria e Transparência</h4>
                      <p className="text-slate-400">Nossa Auditora Executiva, Magadot, assegura que todos os fundos direcionados aos asilos cheguem ao seu destino de forma eficiente e à prova de desvios.</p>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* GALERIA DE IMPACTO (ESPAÇO RESERVADO - OCULTO PARA O LANÇAMENTO) */}
        {false && (
        <section className="py-20 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6">
                <Camera className="w-8 h-8 text-slate-400" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black font-headline tracking-tight text-white mb-4">
                Galeria de <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500">Impacto</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                As histórias de quem abraçamos. Muito em breve, este espaço será preenchido com as fotografias reais das instituições, asilos e orfanatos de todo o Brasil que acolheram a nossa tecnologia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-800/50 bg-[#0a0f1c] group">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05080f] to-transparent opacity-80 z-10" />
                  
                  {/* Wireframe Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center z-0 opacity-10">
                    <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-600 to-transparent blur-2xl" />
                  </div>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                    <span className="text-slate-600 font-bold tracking-widest uppercase text-sm mb-2">Espaço Reservado</span>
                    <p className="text-slate-500 text-xs">Aguardando as primeiras adoções</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* REDE DE PARCEIROS */}
        <section id="parceiros" className="py-20 px-4 relative bg-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-[#0a0f1c] to-[#120a10] border border-slate-800 rounded-3xl p-10 md:p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold text-sm mb-6">
                    <Building2 className="w-4 h-4" />
                    <span>Para Empresas e Investidores</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black font-headline text-white tracking-tight mb-6">
                    Rede de Parceiros:<br/>Adote uma Entidade.
                  </h2>
                  <p className="text-slate-400 text-lg leading-relaxed mb-6">
                    A sustentabilidade desse projeto em larga escala depende de empresas com visão humana. Ao se tornar um parceiro, sua empresa patrocina diretamente o afeto e a atenção para um asilo ou orfanato.
                  </p>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8">
                    Nossa métrica é de <strong className="text-slate-200">transparência absoluta</strong>. O padrinho não paga um valor aleatório; ele financia o custo exato da infraestrutura de vídeo. O cálculo inicial é simples: <strong className="text-emerald-400">2 horas diárias x 30 dias</strong>. Conforme a demanda e o feedback de uso da instituição, essa cota de horas pode ser expandida.
                  </p>
                  
                  <Link 
                    href="/proposito/inscricao-parceiro" 
                    className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 h-14 rounded-full text-lg shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all hover:scale-105"
                  >
                    Quero Ser Parceiro
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="bg-black/40 border border-slate-800 rounded-2xl p-5 hover:border-rose-500/30 transition-colors flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-6 h-6 text-rose-500" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">Impacto Real</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">Financie conversas que curam a solidão de dezenas de idosos e crianças todos os dias.</p>
                    </div>
                  </div>
                  
                  <div className="bg-black/40 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/30 transition-colors flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">Marketing de Propósito & SEO</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">O vídeo de impacto mensal será publicado na Galeria Nexus dedicado à sua marca, com um banner exclusivo e um link direto (backlink) para o site da sua empresa.</p>
                    </div>
                  </div>

                  <div className="bg-black/40 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/30 transition-colors flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">Acervo Privado e Seguro</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">O download em alta resolução do material de impacto é restrito ao e-mail corporativo oficial do padrinho, blindando as imagens dos acolhidos contra o uso indevido por terceiros.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#0f141f] to-[#080b10] border border-slate-800 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 rounded-bl-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-tr-full blur-[80px]" />
            
            <Globe className="w-12 h-12 text-slate-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              "Nunca acima, sempre ao lado."
            </h2>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Ao escolher a tecnologia da Nexus Holding Group, você não está apenas transformando a eficiência da sua empresa. Você está se juntando a uma legião que usa o poder corporativo para curar as dores do mundo.
            </p>
            <Link 
              href="/nexus-empresas" 
              className="inline-flex items-center justify-center bg-rose-600 hover:bg-rose-700 text-white font-bold px-8 h-14 rounded-full text-lg shadow-[0_0_30px_rgba(225,29,72,0.3)] transition-all hover:scale-105"
            >
              Conheça as Nossas Soluções B2B
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </section>

      </main>

      </div>
    </div>
  );
}
