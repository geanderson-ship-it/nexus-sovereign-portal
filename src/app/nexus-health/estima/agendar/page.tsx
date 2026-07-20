"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Sparkles, MapPin, DollarSign, ChevronRight,
  X, CheckCircle, Copy, CreditCard, Smartphone, Lock,
  ChevronLeft, Clock, User, Mail, Phone, HeartPulse
} from "lucide-react";

// ─── Dados mockados ──────────────────────────────────────────────────────────
const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const horarios = ["08:00","08:30","09:00","09:30","10:00","10:30",
                  "11:00","11:30","13:00","13:30","14:00","14:30",
                  "15:00","15:30","16:00","16:30","17:00"];
const ocupados = ["09:00","10:30","14:00","16:00"];

const servicos = [
  { nome: "Consulta Clínica", desc: "Avaliação geral do seu pet", preco: "R$ 150" },
  { nome: "Vacinação Anual", desc: "Pacote V10/V4 + Raiva", preco: "R$ 220" },
  { nome: "Avaliação Cirúrgica", desc: "Triagem para procedimentos complexos", preco: "R$ 300" },
  { nome: "Exames Laboratoriais", desc: "Check-up sanguíneo completo", preco: "A partir de R$ 180" },
  { nome: "Tratamento Dermatológico", desc: "Alergias e controle de parasitas", preco: "A partir de R$ 250" },
  { nome: "Odontologia Pet", desc: "Limpeza de tártaro e profilaxia", preco: "A partir de R$ 450" },
];

function gerarDias() {
  const hoje = new Date();
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() + i + 1);
    return d;
  }).filter(d => d.getDay() !== 0);
}

const formatarDia = (d: Date) =>
  d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });

// ─── Componente Principal ────────────────────────────────────────────────────
export default function AgendarEstimaPage() {
  const [activeModal, setActiveModal] = useState<null | "agenda" | "servicos" | "valores" | "mapa">(null);
  
  // Controle de vídeo de apresentação
  const [videoEnded, setVideoEnded] = useState(false);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  // Controle do vídeo final de sucesso
  const [successVideoEnded, setSuccessVideoEnded] = useState(false);

  // Agenda states
  const [step, setStep] = useState(1);
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null);
  const [horaSelecionada, setHoraSelecionada] = useState<string | null>(null);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", pet: "" });
  const [pagamento, setPagamento] = useState<"pix" | "cartao">("pix");
  const [pixCopiado, setPixCopiado] = useState(false);

  const [dias, setDias] = useState<Date[]>([]);
  useEffect(() => {
    setDias(gerarDias());
  }, []);

  function fecharModal() {
    setActiveModal(null);
    setStep(1);
    setDiaSelecionado(null);
    setHoraSelecionada(null);
    setForm({ nome: "", email: "", telefone: "", pet: "" });
    setPagamento("pix");
    setSuccessVideoEnded(false);
  }

  function confirmarPagamento() { 
    setStep(5); 
    setActiveModal(null); // Fecha o modal para dar total destaque
  }
  function copiarPix() {
    navigator.clipboard.writeText("00020126580014BR.GOV.BCB.PIX0136clinicapet@pix.com.br");
    setPixCopiado(true);
    setTimeout(() => setPixCopiado(false), 3000);
  }

  // Botões de ação principal
  const acoes = [
    {
      id: "agenda",
      icon: Calendar,
      label: "Quero Agendar",
      sub: "Escolha o dia e horário",
      cor: "#f59e0b",
      glow: "rgba(245,158,11,0.4)",
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.3)",
    },
    {
      id: "servicos",
      icon: Sparkles,
      label: "Nossos Serviços",
      sub: "Veja o que oferecemos",
      cor: "#c084fc",
      glow: "rgba(192,132,252,0.4)",
      bg: "rgba(192,132,252,0.08)",
      border: "rgba(192,132,252,0.3)",
    },
    {
      id: "valores",
      icon: DollarSign,
      label: "Valores e Planos",
      sub: "Tabela de preços",
      cor: "#10b981",
      glow: "rgba(16,185,129,0.4)",
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.3)",
    },
    {
      id: "mapa",
      icon: MapPin,
      label: "Como Chegar",
      sub: "Ver no mapa",
      cor: "#fb923c",
      glow: "rgba(251,146,60,0.4)",
      bg: "rgba(251,146,60,0.08)",
      border: "rgba(251,146,60,0.3)",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050a11] text-white flex flex-col">

      {/* ═══ IMAGEM DE APRESENTAÇÃO ═══════════════════════════════ */}
      <div className="relative w-full bg-black">
        <div className="relative w-full">
          {/* Vídeo tocando — some quando termina */}
          {!videoEnded && (
            <video
              ref={videoRef}
              autoPlay
              muted={muted}
              playsInline
              controls
              onEnded={handleVideoEnd}
              className="w-full aspect-video object-cover"
            >
              <source src="/luna-apresentacao.mp4" type="video/mp4" />
            </video>
          )}

          {/* Imagem Substituta (Poster) — aparece quando termina */}
          {videoEnded && (
            <Image
              src="/luna-animale-v2.jpg"
              alt="Luna — Atendente Virtual Veterinária"
              width={1920}
              height={1080}
              className="w-full aspect-video object-cover"
              priority
            />
          )}
          {/* Gradiente suave na base da imagem */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050a11] to-transparent" />
        </div>

        {/* Badge Online — sempre visível */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f59e0b] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f59e0b]"></span>
          </span>
          <span className="text-[11px] font-bold text-white/80 uppercase tracking-widest bg-black/30 backdrop-blur px-2 py-0.5 rounded-full">Online</span>
        </div>
      </div>

      {/* ═══ ÁREA DE INTERAÇÃO ══════════════════════════════════ */}
      <div className="flex-1 px-5 py-6 space-y-4 max-w-2xl mx-auto w-full">

        {/* Bolha de fala */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="flex items-end gap-3"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#fb923c] to-[#f59e0b] p-[2px] shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.5)]">
            <div className="w-full h-full rounded-full bg-[#050a11] flex items-center justify-center overflow-hidden">
               <Image src="/luna-animale.jpg" alt="Luna" width={32} height={32} className="object-cover object-center h-full w-full" />
            </div>
          </div>
          <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-5 py-3 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
            <p className="text-white text-sm leading-relaxed">
              Olá, eu sou a Luna! 👋 <span className="text-gray-400">Em que posso te ajudar?</span>
            </p>
          </div>
        </motion.div>

        {/* Botões */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {acoes.map((acao, i) => (
            <motion.button
              key={acao.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              onClick={() => setActiveModal(acao.id as any)}
              className="flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-2xl border transition-all hover:scale-[1.03] active:scale-[0.97]"
              style={{ background: acao.bg, borderColor: acao.border }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 6px 25px ${acao.glow}`)}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${acao.cor}22` }}>
                <acao.icon className="w-5 h-5" style={{ color: acao.cor }} />
              </div>
              <span className="text-xs font-bold text-white text-center">{acao.label}</span>
              <span className="text-[10px] text-gray-500 text-center">{acao.sub}</span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* ═══ OVERLAY DE MODAIS ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm"
            onClick={e => e.target === e.currentTarget && fecharModal()}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative w-full sm:max-w-lg bg-[#0b121e] border border-white/10 rounded-t-3xl sm:rounded-2xl shadow-[0_-10px_60px_rgba(0,0,0,0.6)] overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Handle mobile */}
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-3 sm:hidden shrink-0" />

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/20 shrink-0">
                <div className="flex items-center gap-2">
                  {activeModal === "agenda" && <Calendar className="w-4 h-4 text-[#f59e0b]" />}
                  {activeModal === "servicos" && <Sparkles className="w-4 h-4 text-purple-400" />}
                  {activeModal === "valores" && <DollarSign className="w-4 h-4 text-[#10b981]" />}
                  {activeModal === "mapa" && <MapPin className="w-4 h-4 text-orange-400" />}
                  <span className="font-bold text-white text-sm">
                    {activeModal === "agenda" && "Agendar Consulta"}
                    {activeModal === "servicos" && "Nossos Serviços"}
                    {activeModal === "valores" && "Tabela de Preços"}
                    {activeModal === "mapa" && "Nossa Localização"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {activeModal === "agenda" && step < 5 && (
                    <div className="flex gap-1.5">
                      {[1,2,3,4].map(s => (
                        <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${s <= step ? "bg-[#f59e0b] w-5" : "bg-white/20 w-2"}`} />
                      ))}
                    </div>
                  )}
                  <button onClick={fecharModal} className="text-gray-400 hover:text-white transition-colors p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Conteúdo Rolável */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">

                {/* ── MODAL: AGENDA ────────────────────────────── */}
                {activeModal === "agenda" && (
                  <AnimatePresence mode="wait">

                    {step === 1 && (
                      <motion.div key="s1" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                        <p className="text-gray-400 text-sm mb-4">Selecione uma data para a consulta:</p>
                        <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                          {dias.map((d, i) => (
                            <button key={i} onClick={() => setDiaSelecionado(d)}
                              className={`p-3 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                                diaSelecionado?.toDateString() === d.toDateString()
                                  ? "bg-[#f59e0b]/20 border-[#f59e0b] text-white"
                                  : "bg-white/5 border-white/10 text-gray-300 hover:border-white/30"
                              }`}
                            >
                              <span className="text-[10px] uppercase text-gray-500">{diasSemana[d.getDay()]}</span>
                              <span className="text-base font-bold">{d.getDate()}</span>
                              <span className="text-[10px] text-gray-500">{d.toLocaleDateString("pt-BR",{month:"short"})}</span>
                            </button>
                          ))}
                        </div>
                        <button disabled={!diaSelecionado} onClick={() => setStep(2)}
                          className="w-full mt-5 py-3 bg-[#f59e0b] text-black font-bold rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all">
                          Continuar →
                        </button>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div key="s2" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                          <Calendar className="w-4 h-4 text-[#f59e0b]" />
                          {diaSelecionado && formatarDia(diaSelecionado)}
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {horarios.map(h => {
                            const ocupado = ocupados.includes(h);
                            return (
                              <button key={h} disabled={ocupado} onClick={() => setHoraSelecionada(h)}
                                className={`py-2.5 rounded-lg text-sm font-bold border transition-all ${
                                  ocupado ? "opacity-30 cursor-not-allowed bg-white/5 border-white/5 text-gray-500 line-through"
                                  : horaSelecionada === h ? "bg-[#f59e0b]/20 border-[#f59e0b] text-white"
                                  : "bg-white/5 border-white/10 text-gray-300 hover:border-white/30"
                                }`}>
                                {h}
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex gap-3 mt-5">
                          <button onClick={() => setStep(1)} className="flex-1 py-3 bg-white/5 border border-white/10 text-gray-300 font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <ChevronLeft className="w-4 h-4" /> Voltar
                          </button>
                          <button disabled={!horaSelecionada} onClick={() => setStep(3)}
                            className="flex-1 py-3 bg-[#f59e0b] text-black font-bold rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                            Continuar →
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div key="s3" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="space-y-4">
                        <div className="p-3 bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-xl text-sm text-[#f59e0b] font-medium flex items-center gap-2">
                          <Clock className="w-4 h-4 shrink-0" />
                          {diaSelecionado && formatarDia(diaSelecionado)} às {horaSelecionada}
                        </div>
                        {[
                          { label: "Seu Nome (Tutor)", key: "nome", icon: User, placeholder: "Ex: Ana Carolina" },
                          { label: "Nome do Pet", key: "pet", icon: HeartPulse, placeholder: "Ex: Thor" },
                          { label: "WhatsApp", key: "telefone", icon: Phone, placeholder: "(11) 99999-9999" },
                        ].map(f => (
                          <div key={f.key}>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                            <div className="relative">
                              <f.icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                              <input type="text" placeholder={f.placeholder}
                                value={(form as any)[f.key]}
                                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                                className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-[#f59e0b]/50 transition-colors"
                              />
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-3 pt-2">
                          <button onClick={() => setStep(2)} className="flex-1 py-3 bg-white/5 border border-white/10 text-gray-300 font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <ChevronLeft className="w-4 h-4" /> Voltar
                          </button>
                          <button disabled={!form.nome || !form.pet || !form.telefone} onClick={() => setStep(4)}
                            className="flex-1 py-3 bg-[#f59e0b] text-black font-bold rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                            Ir para Pagamento →
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {step === 4 && (
                      <motion.div key="s4" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                        <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
                          <Lock className="w-4 h-4 text-[#10b981]" /> Taxa de agendamento (Garante a vaga)
                        </p>
                        <div className="flex gap-2 mb-5">
                          {[{key:"pix",label:"PIX",icon:Smartphone},{key:"cartao",label:"Cartão",icon:CreditCard}].map(op => (
                            <button key={op.key} onClick={() => setPagamento(op.key as any)}
                              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                                pagamento === op.key ? "bg-[#10b981]/20 border-[#10b981] text-[#10b981]"
                                : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30"
                              }`}>
                              <op.icon className="w-4 h-4" /> {op.label}
                            </button>
                          ))}
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4 text-sm space-y-1.5">
                          <div className="flex justify-between text-gray-400"><span>Taxa de reserva</span><span className="text-white font-bold">R$ 50,00</span></div>
                          <div className="flex justify-between text-gray-500 text-xs"><span>{diaSelecionado && formatarDia(diaSelecionado)} às {horaSelecionada}</span><span className="text-[#10b981]">Confirmado após pagto.</span></div>
                        </div>
                        {pagamento === "pix" && (
                          <div className="space-y-3">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                              <div className="w-28 h-28 bg-white rounded-lg mx-auto mb-3 flex items-center justify-center">
                                <span className="text-[7px] text-black font-mono text-center px-2">QR Code PIX</span>
                              </div>
                            </div>
                            <button onClick={copiarPix}
                              className={`w-full py-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${pixCopiado ? "bg-[#10b981]/20 border-[#10b981] text-[#10b981]" : "bg-white/5 border-white/20 text-gray-300 hover:bg-white/10"}`}>
                              <Copy className="w-4 h-4" /> {pixCopiado ? "Código copiado!" : "Copiar código PIX"}
                            </button>
                            <button onClick={confirmarPagamento}
                              className="w-full py-3 bg-[#10b981] text-black font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition-all text-sm">
                              Já paguei — Confirmar Agendamento ✓
                            </button>
                          </div>
                        )}
                        {pagamento === "cartao" && (
                          <div className="space-y-3">
                            <input placeholder="Número do cartão" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-[#f59e0b]/50" />
                            <div className="grid grid-cols-2 gap-3">
                              <input placeholder="Validade (MM/AA)" className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-[#f59e0b]/50" />
                              <input placeholder="CVV" className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-[#f59e0b]/50" />
                            </div>
                            <input placeholder="Nome no cartão" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-[#f59e0b]/50" />
                            <button onClick={confirmarPagamento}
                              className="w-full py-3 bg-[#10b981] text-black font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition-all text-sm flex items-center justify-center gap-2">
                              <Lock className="w-4 h-4" /> Pagar R$ 50,00 e Confirmar
                            </button>
                          </div>
                        )}
                        <button onClick={() => setStep(3)} className="w-full mt-3 py-2 text-gray-500 hover:text-gray-300 text-sm transition-colors flex items-center justify-center gap-1">
                          <ChevronLeft className="w-4 h-4" /> Voltar
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {/* ── MODAL: SERVIÇOS ──────────────────────────── */}
                {activeModal === "servicos" && (
                  <div className="space-y-3">
                    <p className="text-gray-400 text-sm mb-4">Especialidades Veterinárias:</p>
                    {servicos.map((s, i) => (
                      <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
                        className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/30 hover:bg-purple-500/5 transition-all cursor-pointer group"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">{s.nome}</h3>
                            <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
                          </div>
                          <span className="text-xs font-bold text-purple-400 whitespace-nowrap ml-4">{s.preco}</span>
                        </div>
                      </motion.div>
                    ))}
                    <button onClick={() => { fecharModal(); setTimeout(() => setActiveModal("agenda"), 100); }}
                      className="w-full mt-4 py-3 bg-[#f59e0b] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" /> Quero Agendar Agora
                    </button>
                  </div>
                )}

                {/* ── MODAL: VALORES ───────────────────────────── */}
                {activeModal === "valores" && (
                  <div className="space-y-3">
                    <p className="text-gray-400 text-sm mb-4">Tabela de Valores Oficiais:</p>
                    {servicos.map((s, i) => (
                      <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
                        className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-xl"
                      >
                        <span className="text-gray-300 text-sm font-medium">{s.nome}</span>
                        <span className="font-bold text-[#10b981] text-sm">{s.preco}</span>
                      </motion.div>
                    ))}
                    <div className="p-4 bg-[#10b981]/10 border border-[#10b981]/20 rounded-xl text-sm text-gray-300 mt-4">
                      💳 Aceitamos: PIX e parcelamento no Cartão.
                    </div>
                    <button onClick={() => { fecharModal(); setTimeout(() => setActiveModal("agenda"), 100); }}
                      className="w-full mt-2 py-3 bg-[#f59e0b] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" /> Quero Agendar Agora
                    </button>
                  </div>
                )}

                {/* ── MODAL: MAPA ──────────────────────────────── */}
                {activeModal === "mapa" && (
                  <div className="space-y-4">
                    <div className="w-full h-56 bg-white/5 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <MapPin className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Mapa integrado aqui</p>
                      </div>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2 text-sm">
                      <p className="font-bold text-white flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-400" /> Vet Care Plus Hospital</p>
                      <p className="text-gray-400">Av. dos Animais, 88 — Brooklin, São Paulo - SP</p>
                      <p className="text-gray-400">Atendimento 24h para emergências.</p>
                    </div>
                    <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
                      className="w-full py-3 bg-orange-500/20 border border-orange-500/30 text-orange-400 font-bold rounded-xl hover:bg-orange-500/30 transition-all flex items-center justify-center gap-2">
                      <MapPin className="w-4 h-4" /> Abrir no Google Maps
                    </a>
                    <button onClick={() => { fecharModal(); setTimeout(() => setActiveModal("agenda"), 100); }}
                      className="w-full py-3 bg-[#f59e0b] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" /> Agendar Minha Consulta
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* ═══ VÍDEO DE FINALIZAÇÃO (FULLSCREEN) ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {step === 5 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] bg-[#050a11] flex flex-col justify-between"
          >
            <video
              autoPlay
              playsInline
              controls
              poster="/luna-animale-v2.jpg"
              className="w-full object-cover object-top"
              style={{ maxHeight: "85vh" }}
              onEnded={() => setSuccessVideoEnded(true)}
            >
              <source src="/luna-ate-breve.mp4" type="video/mp4" />
            </video>
            
            {/* Gradiente na base e Mensagem de Sucesso Flutuante */}
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#050a11] to-transparent pointer-events-none z-0" />
            
            {successVideoEnded && (
              <div className="absolute bottom-12 inset-x-0 flex justify-center z-10 px-4">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 1, type: "spring" }} 
                  className="bg-[rgba(11,18,30,0.8)] backdrop-blur-xl border border-[#f59e0b]/30 p-6 md:p-8 rounded-2xl text-center max-w-lg w-full shadow-[0_0_40px_rgba(245,158,11,0.15)]"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Tudo certo, {form.nome.split(" ")[0]}! 🎉</h2>
                  <p className="text-sm md:text-base text-gray-300 mb-2">
                    O horário do(a) <strong className="text-[#f59e0b]">{form.pet}</strong> está garantido para <strong className="text-white">{diaSelecionado && formatarDia(diaSelecionado)} às {horaSelecionada}</strong>.
                  </p>
                  <p className="text-xs md:text-sm text-gray-400 italic mb-4">
                    "Nossa equipe está pronta para receber o seu pet com todo o carinho e cuidado que ele(a) merece. Desejamos muita saúde e uma ótima recuperação. A Vet Care Plus agradece pela confiança!"
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm md:text-base text-[#10b981] font-semibold flex items-center justify-center gap-2">
                      <HeartPulse className="w-5 h-5" />
                      Eu (Luna) acabei de enviar os detalhes no seu WhatsApp.
                    </p>
                  </div>
                  
                  <button onClick={fecharModal} className="mt-8 px-6 py-2 bg-[#f59e0b] text-black font-bold rounded-full hover:bg-[#f59e0b]/90 transition-colors text-sm shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                    Concluir e Voltar
                  </button>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
