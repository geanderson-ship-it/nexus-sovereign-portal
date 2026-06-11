'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Shield, Sparkles, Sprout, Users, Landmark, Activity, Target, Satellite, ChevronRight, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
import { IAPaymentModal } from '@/components/maga/ia-payment-modal';

export default function AgroPage() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  return (
    <SovereignShowcase moduleName="Dante Safra" imagePath="/Nexus Empresas/Dante safra axis.png">
      <div className="min-h-screen text-white font-sans selection:bg-emerald-500/30 relative">
        {/* BACKGROUND PREMIUM CUSTOMIZADO */}
        <div 
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: "url('/Agro/agro-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        {/* FILME ESCURECEDOR SUAVE PARA GARANTIR LEITURA */}
        <div className="fixed inset-0 z-0 bg-slate-950/85 backdrop-blur-sm pointer-events-none" />

        {/* NAVEGAÇÃO SUPERIOR (Secundária) */}
        <nav className="absolute top-20 left-0 w-full z-40 p-6 px-6 md:px-12 flex justify-between items-center pointer-events-none">
          <Link href="/" className="pointer-events-auto text-emerald-500 hover:text-white transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em]">
            <ChevronLeft className="h-4 w-4" /> Voltar ao Início
          </Link>
          <div className="flex items-center gap-3 pointer-events-auto">
            <Shield className="h-4 w-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 hidden sm:block">Terminal Dante Safra</span>
          </div>
        </nav>

        <main className="relative z-10 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col gap-32">
          
          {/* HERO SECTION */}
          <section className="flex flex-col items-center text-center gap-8 mt-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4"
            >
              <Target className="h-8 w-8 text-emerald-400" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]"
            >
              O Terminal Tático<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-emerald-600">Do Agronegócio</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="text-slate-400 text-lg md:text-2xl font-light tracking-wide max-w-3xl leading-relaxed"
            >
              Inteligência Artificial de Precisão e Telemetria Neural. Da semente à exportação, mantenha a sua terra e as suas safras sob controle absoluto.
            </motion.p>
          </section>

          {/* MATRIZ DE FORÇA (O Músculo do Dante) */}
          <section className="flex flex-col gap-12">
            <div className="text-center">
              <h2 className="text-3xl font-black uppercase tracking-widest text-emerald-400 flex items-center justify-center gap-3">
                <Activity className="h-6 w-6" /> Matriz Operacional
              </h2>
              <p className="text-sm text-slate-400 mt-4 max-w-2xl mx-auto uppercase tracking-widest">
                A tecnologia que protege o seu patrimônio no campo
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Visão Computacional", desc: "Tire fotos de pragas ou doenças na folha. O Dante identifica a ameaça em segundos e fornece o protocolo de neutralização imediato.", icon: <Sparkles className="h-6 w-6 text-emerald-400" /> },
                { title: "Sincronia Climática", desc: "Cruzamento de dados meteorológicos globais com o microclima da sua fazenda. Saiba exatamente a janela perfeita de plantio e colheita.", icon: <Satellite className="h-6 w-6 text-emerald-400" /> },
                { title: "Controle Zootécnico", desc: "Acompanhe pesagem, consumo de ração e índices de saúde do rebanho em tempo real pelo terminal de bolso.", icon: <Activity className="h-6 w-6 text-emerald-400" /> }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="p-8 rounded-2xl bg-slate-900/50 border border-emerald-900/30 hover:border-emerald-500/50 transition-colors group"
                >
                  <div className="p-4 rounded-xl bg-emerald-500/10 w-fit mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* PERFIS DE ESCALA (Preços e Planos) */}
          <section className="flex flex-col gap-12 mt-12 relative z-10">
            <div className="flex flex-col gap-4 relative">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                Níveis de <span className="text-emerald-500">Acesso</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl font-light">
                Escolha a sua categoria de comando. Soluções dimensionadas para a realidade da sua operação tática.
              </p>
            </div>

            <div className="flex flex-col gap-8">
              
              {/* AGRICULTOR */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="w-full p-8 md:p-12 rounded-[40px] bg-gradient-to-r from-slate-900/80 to-slate-950 border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-12 shadow-[0_0_80px_rgba(16,185,129,0.05)] relative overflow-hidden group hover:border-emerald-500/40 transition-all"
              >
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                
                <div className="flex flex-col gap-4 relative z-10 w-full md:w-5/12">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-emerald-500/20"><Sprout className="h-6 w-6 text-emerald-400" /></div>
                    <span className="text-emerald-500 text-xs font-black uppercase tracking-[0.4em]">Produtor de Precisão</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">Agricultor</h2>
                  <p className="text-slate-400 mt-2">O Dante Safra cuida da sua propriedade de A a Z. Da semente na terra ao dinheiro no bolso.</p>
                  <ul className="flex flex-col gap-2 mt-4">
                    <li className="flex items-start gap-2 text-sm text-slate-300"><Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /> Monitoramento Mobile de Culturas e Pragas</li>
                    <li className="flex items-start gap-2 text-sm text-slate-300"><Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /> Suporte Inteligente via Chat para decisões rápidas</li>
                  </ul>
                </div>

                <div className="hidden md:block w-px h-32 bg-white/10 relative z-10" />

                <div className="flex flex-col relative z-10 w-full md:w-5/12 gap-6 bg-slate-950/50 p-8 rounded-3xl border border-emerald-900/50">
                  <div>
                    <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-2">Licença Anual</p>
                    <h4 className="text-5xl font-black text-white tracking-tighter">R$ 999,00</h4>
                    <p className="text-xs text-slate-500 mt-2 font-medium">Pagamento instantâneo via PIX. Setup Imediato.</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full h-12 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all">
                          Ver Detalhes do Dante Safra
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-950 border border-emerald-900/50 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-black uppercase tracking-tight text-emerald-400 flex items-center gap-3 mb-4">
                            <Sprout className="h-6 w-6" /> O Poder do Dante Safra
                          </DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-6">
                          <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-emerald-500 pl-4">
                            O Dante Safra não é um aplicativo comum. Ele é o equivalente a ter um engenheiro agrônomo sênior, um veterinário e um analista de mercado disponíveis 24 horas por dia no seu bolso, prontos para responder qualquer pergunta sobre a sua lida no campo.
                          </p>
                          <div className="grid grid-cols-1 gap-4">
                            
                            <div className="p-5 rounded-xl bg-slate-900/50 border border-emerald-900/30 flex flex-col gap-2">
                              <h5 className="font-bold text-white uppercase tracking-wider text-xs text-emerald-400 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> 1. Diagnóstico de Pragas e Doenças (Visão Computacional)
                              </h5>
                              <p className="text-xs text-slate-400 leading-relaxed">
                                Em vez de esperar dias pela visita do técnico e ver a lavoura ser comida, você tira uma foto da folha (soja com ferrugem, milho com lagarta, fumo com mosaico). O Dante cruza a imagem com bancos de dados globais, te dá o diagnóstico exato e recomenda a dosagem do defensivo necessário em segundos.
                              </p>
                            </div>

                            <div className="p-5 rounded-xl bg-slate-900/50 border border-emerald-900/30 flex flex-col gap-2">
                              <h5 className="font-bold text-white uppercase tracking-wider text-xs text-emerald-400 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> 2. Consultoria Multicultura (Sua terra, sua regra)
                              </h5>
                              <p className="text-xs text-slate-400 leading-relaxed">
                                Não importa se a sua roça é de soja, arroz, trigo, milho, fumo ou hortaliça. Você pode perguntar como otimizar a calagem para o seu tipo de solo argiloso, qual o espaçamento ideal de sementes, ou como fazer o manejo da irrigação. O Dante formula a resposta adaptada para a sua realidade.
                              </p>
                            </div>

                            <div className="p-5 rounded-xl bg-slate-900/50 border border-emerald-900/30 flex flex-col gap-2">
                              <h5 className="font-bold text-white uppercase tracking-wider text-xs text-emerald-400 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> 3. Manejo Zootécnico (Gado, Suínos e Aves)
                              </h5>
                              <p className="text-xs text-slate-400 leading-relaxed">
                                Identificou um animal isolado no pasto ou com sintomas anormais? Descreva para o Dante. Ele te ajuda com um pré-diagnóstico veterinário, sugere protocolos de isolamento e até ajuda a formular a ração ideal para ganho de peso, otimizando os insumos que você já tem no galpão.
                              </p>
                            </div>

                            <div className="p-5 rounded-xl bg-slate-900/50 border border-emerald-900/30 flex flex-col gap-2">
                              <h5 className="font-bold text-white uppercase tracking-wider text-xs text-emerald-400 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> 4. Clima e Decisão de Mercado (Bolsa de Chicago)
                              </h5>
                              <p className="text-xs text-slate-400 leading-relaxed">
                                O produtor muitas vezes perde dinheiro porque vende na hora errada. O Dante analisa as tendências de mercado, o preço do dólar e cruza com os dados climáticos. Pergunte se a janela da próxima semana é boa pro plantio, ou se é melhor segurar a safra no silo esperando o preço subir.
                              </p>
                            </div>

                            <div className="p-5 rounded-xl bg-emerald-900/20 border border-emerald-500/30 flex flex-col gap-2">
                              <h5 className="font-bold text-white uppercase tracking-wider text-xs text-emerald-400 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> 5. Simplicidade Absoluta (Acesso Fácil)
                              </h5>
                              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                O agricultor não precisa ser especialista em computador. Basta abrir o celular e conversar com o Dante Safra pelo chat, mandando foto ou texto, direto da lavoura, de forma tão simples quanto mandar uma mensagem para um vizinho.
                              </p>
                            </div>

                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] rounded-xl"
                    >
                      Ativar Terminal Agro via PIX
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* COOPERATIVA E PREFEITURA (Grid Inferior) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* COOPERATIVA */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 md:p-10 rounded-[40px] bg-slate-900/50 border border-emerald-900/30 flex flex-col gap-8 hover:border-emerald-500/30 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-slate-800"><Users className="h-6 w-6 text-emerald-400" /></div>
                      <span className="text-emerald-500 text-xs font-black uppercase tracking-[0.4em]">Sinergia & Escala</span>
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Cooperativa</h3>
                    <p className="text-slate-400 text-sm mb-6">Garantia de safra cheia e padrão de excelência para os seus associados.</p>
                    
                    <ul className="flex flex-col gap-4">
                      <li className="flex flex-col gap-1 border-l-2 border-emerald-500/30 pl-3">
                        <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Grãos de Primeira</span>
                        <span className="text-slate-400 text-xs leading-relaxed">Seu associado chega no recebimento com produto de qualidade? O Dante acompanhou a lavoura do começo ao fim. Menos perda, menos desconto, mais dinheiro para o produtor e para a cooperativa.</span>
                      </li>
                      <li className="flex flex-col gap-1 border-l-2 border-emerald-500/30 pl-3">
                        <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Escudo Contra Pragas</span>
                        <span className="text-slate-400 text-xs leading-relaxed">Uma praga não avisa hora de chegar. O Dante monitora de forma contínua e protege as lavouras dos seus associados antes que o estrago vire prejuízo grande.</span>
                      </li>
                      <li className="flex flex-col gap-1 border-l-2 border-emerald-500/30 pl-3">
                        <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Fomento Inteligente</span>
                        <span className="text-slate-400 text-xs leading-relaxed">Chega de planejar insumos e crédito no achismo. Com dados reais de cada produtor, a cooperativa financia com segurança, compra melhor e entrega mais resultado.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="relative z-10 mt-auto">
                    <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-1">Implementação Corporativa</p>
                    <h4 className="text-3xl font-black text-white tracking-tighter mb-6">Sob Consulta</h4>
                    <Link href="https://wa.me/5551999799582?text=%5BDANTE%20SAFRA%20-%20COOPERATIVA%5D%20Ol%C3%A1.%20Gostaria%20de%20discutir%20a%20implanta%C3%A7%C3%A3o%20do%20terminal%20t%C3%A1tico%20Dante%20para%20minha%20rede%20de%20associados." target="_blank" className="w-full block">
                      <div className="w-full py-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-center transition-all flex items-center justify-center gap-3">
                        <span className="text-emerald-400 font-black uppercase tracking-[0.2em] text-xs">Acionar Especialista</span>
                        <ChevronRight className="h-4 w-4 text-emerald-400" />
                      </div>
                    </Link>
                  </div>
                </motion.div>

                {/* PREFEITURA */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="p-8 md:p-10 rounded-[40px] bg-slate-900/50 border border-emerald-900/30 flex flex-col gap-8 hover:border-emerald-500/30 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-slate-800"><Landmark className="h-6 w-6 text-emerald-400" /></div>
                      <span className="text-emerald-500 text-xs font-black uppercase tracking-[0.4em]">GovTech</span>
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Município</h3>
                    <p className="text-slate-400 text-sm mb-6">Transforme sua cidade no próximo Polo de Tecnologia Agrícola.</p>

                    <ul className="flex flex-col gap-4">
                      <li className="flex flex-col gap-1 border-l-2 border-emerald-500/30 pl-3">
                        <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Município Destaque</span>
                        <span className="text-slate-400 text-xs leading-relaxed">Imagina sua cidade na TV como referência em tecnologia no campo? O Dante Safra vira um projeto pioneiro que coloca a prefeitura no mapa e orgulha cada morador.</span>
                      </li>
                      <li className="flex flex-col gap-1 border-l-2 border-emerald-500/30 pl-3">
                        <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Escola do Futuro</span>
                        <span className="text-slate-400 text-xs leading-relaxed">O jovem que aprende IA na roça não precisa ir pra cidade. Capacite os alunos da rede pública com a profissão que o agro pede. Família unida, campo forte.</span>
                      </li>
                      <li className="flex flex-col gap-1 border-l-2 border-emerald-500/30 pl-3">
                        <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Dinheiro que Fica Aqui</span>
                        <span className="text-slate-400 text-xs leading-relaxed">Produtor que produz mais emite mais nota e movimenta o comércio local. Sem aumentar tributo, a prefeitura vê a arrecadação crescer junto com a lavoura.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="relative z-10 mt-auto">
                    <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-1">Licitação / B2G</p>
                    <h4 className="text-3xl font-black text-white tracking-tighter mb-6">Sob Consulta</h4>
                    <Link href="https://wa.me/5551999799582?text=%5BDANTE%20SAFRA%20-%20GOVTECH%5D%20Ol%C3%A1.%20Tenho%20interesse%20em%20implantar%20a%20intelig%C3%AAncia%20t%C3%A1tica%20Dante%20no%20munic%C3%ADpio%20atrav%C3%A9s%20de%20parceria%20GovTech." target="_blank" className="w-full block">
                      <div className="w-full py-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-center transition-all flex items-center justify-center gap-3">
                        <span className="text-emerald-400 font-black uppercase tracking-[0.2em] text-xs">Acionar Setor B2G</span>
                        <ChevronRight className="h-4 w-4 text-emerald-400" />
                      </div>
                    </Link>
                  </div>
                </motion.div>

              </div>
            </div>
          </section>

        </main>
      </div>

      {/* MODAL PIX PARA AGRICULTOR */}
      <IAPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        iaName="Dante Safra Agro - Agricultor"
        pixKey="+5551999799582"
        annualPrice="R$ 999,00"
        isSinglePrice={true}
        singlePriceLabel="Licença Anual"
        onSuccess={() => setIsPaymentModalOpen(false)}
      />
    </SovereignShowcase>
  );
}
