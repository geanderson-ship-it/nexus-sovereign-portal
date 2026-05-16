'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  ChevronLeft, ChevronRight, CheckCircle, User, Phone,
  MapPin, HeartPulse, ShieldCheck, FileText, AlertTriangle, Lock
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// ─── STEPS ───────────────────────────────────────────────────────────────────
const steps = [
  { id: 1, label: 'Dados Pessoais',   icon: User },
  { id: 2, label: 'Contato',          icon: Phone },
  { id: 3, label: 'Dados Clínicos',   icon: HeartPulse },
  { id: 4, label: 'Consentimento',    icon: ShieldCheck },
];

// ─── FIELD COMPONENT ─────────────────────────────────────────────────────────
function Field({
  label, id, type = 'text', placeholder, required, className, children
}: {
  label: string; id: string; type?: string; placeholder?: string;
  required?: boolean; className?: string; children?: React.ReactNode;
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {label}{required && <span className="text-teal-400 ml-1">*</span>}
      </label>
      {children ?? (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:bg-teal-500/5 transition-all"
        />
      )}
    </div>
  );
}

function Select({ label, id, required, options, className }: {
  label: string; id: string; required?: boolean; options: string[]; className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {label}{required && <span className="text-teal-400 ml-1">*</span>}
      </label>
      <select
        id={id}
        className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500/50 focus:bg-teal-500/5 transition-all appearance-none"
      >
        <option value="" className="bg-slate-900">Selecione...</option>
        {options.map((o) => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
      </select>
    </div>
  );
}

function Textarea({ label, id, placeholder, required, className }: {
  label: string; id: string; placeholder?: string; required?: boolean; className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {label}{required && <span className="text-teal-400 ml-1">*</span>}
      </label>
      <textarea
        id={id}
        placeholder={placeholder}
        rows={3}
        className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:bg-teal-500/5 transition-all resize-none"
      />
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function HealthCadastroPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [consents, setConsents] = useState({ ai: false, data: false, share: false });
  const [submitted, setSubmitted] = useState(false);

  const progress = ((step - 1) / (steps.length - 1)) * 100;

  const handleNext = () => { if (step < steps.length) setStep(step + 1); };
  const handleBack = () => { if (step > 1) setStep(step - 1); };
  const handleSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-teal-600/5 rounded-full blur-[120px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-lg w-full text-center space-y-6 p-12 rounded-[48px] bg-teal-500/5 border-2 border-teal-500/30"
        >
          <div className="mx-auto w-24 h-24 rounded-full bg-teal-500/20 border-2 border-teal-500/40 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-teal-400" />
          </div>
          <div>
            <Badge className="bg-teal-600 text-white font-black text-[10px] uppercase tracking-widest px-4 mb-4">CADASTRO CONCLUÍDO</Badge>
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Bem-vindo ao<br /><span className="text-teal-400">Nexus Health</span></h1>
            <p className="text-slate-400 mt-3 leading-relaxed">Seu perfil clínico foi criado com sucesso. Você já pode começar a enviar imagens médicas para análise por IA.</p>
          </div>
          <div className="flex flex-col gap-3">
            <Button asChild className="bg-teal-600 hover:bg-teal-500 text-white font-black uppercase tracking-widest h-12 rounded-2xl gap-2">
              <Link href="/intelligence/health"><HeartPulse className="h-4 w-4" /> Ir para o Painel</Link>
            </Button>
            <Button asChild variant="ghost" className="text-slate-500 hover:text-white font-black uppercase text-xs">
              <Link href="/intelligence">Voltar ao Hub</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden">

      {/* AMBIENT */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-teal-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-cyan-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-10 space-y-8">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-500 hover:text-white gap-2 text-xs">
              <ChevronLeft className="h-3 w-3" /> Voltar
            </Button>
            <Separator orientation="vertical" className="h-4 bg-white/10" />
            <Badge className="bg-teal-500/20 text-teal-400 border border-teal-500/30 font-black text-[9px] uppercase tracking-[0.3em] px-3">
              CADASTRO DE PACIENTE
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <Lock className="h-3 w-3 text-teal-400" />
            <span className="font-black uppercase tracking-widest">LGPD Protegido</span>
          </div>
        </motion.div>

        {/* TITLE */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
            Criar <span className="text-teal-400">Perfil Clínico</span>
          </h1>
          <p className="text-slate-400 text-sm">Preencha seus dados para habilitar a análise de imagens médicas por IA.</p>
        </motion.div>

        {/* STEP INDICATOR */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => {
              const done = step > s.id;
              const active = step === s.id;
              return (
                <React.Fragment key={s.id}>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={cn(
                      'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                      done ? 'bg-teal-500 border-teal-500' :
                      active ? 'border-teal-500 bg-teal-500/10' :
                      'border-white/10 bg-white/3'
                    )}>
                      {done
                        ? <CheckCircle className="h-5 w-5 text-white" />
                        : <s.icon className={cn('h-4 w-4', active ? 'text-teal-400' : 'text-slate-600')} />
                      }
                    </div>
                    <span className={cn('text-[9px] font-black uppercase tracking-widest hidden sm:block', active ? 'text-teal-400' : done ? 'text-slate-400' : 'text-slate-600')}>
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={cn('flex-1 h-[2px] mx-2 rounded-full transition-all duration-500', step > s.id ? 'bg-teal-500' : 'bg-white/8')} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <Progress value={progress} className="h-1 bg-white/5 [&>div]:bg-teal-500 [&>div]:transition-all [&>div]:duration-500" />
          <p className="text-[10px] text-slate-500 text-right font-black uppercase tracking-widest">
            Etapa {step} de {steps.length}
          </p>
        </div>

        {/* FORM CARD */}
        <AnimatePresence mode="wait">

          {/* STEP 1 — DADOS PESSOAIS */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-white/3 border border-white/8 rounded-[40px] p-8 space-y-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-teal-500/10 rounded-xl"><User className="h-5 w-5 text-teal-400" /></div>
                <h2 className="text-lg font-black text-white uppercase italic">Dados Pessoais</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Nome Completo" id="nome" placeholder="Maria da Silva" required className="md:col-span-2" />
                <Field label="CPF" id="cpf" placeholder="000.000.000-00" required />
                <Field label="Data de Nascimento" id="nascimento" type="date" required />
                <Select label="Sexo Biológico" id="sexo" required options={['Feminino', 'Masculino', 'Intersexo']} />
                <Select label="Raça/Cor (IBGE)" id="raca" options={['Branca', 'Preta', 'Parda', 'Amarela', 'Indígena', 'Prefiro não informar']} />
                <Field label="Nome da Mãe" id="nomemae" placeholder="Nome completo da mãe" className="md:col-span-2" />
                <Field label="RG / CNH" id="rg" placeholder="00.000.000-0" />
                <Select label="Estado Civil" id="estadocivil" options={['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável']} />
                <Select label="Plano de Saúde" id="plano" options={['Nenhum (SUS)', 'Unimed', 'Amil', 'Bradesco Saúde', 'SulAmérica', 'Hapvida', 'Outro']} className="md:col-span-2" />
              </div>
            </motion.div>
          )}

          {/* STEP 2 — CONTATO */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-white/3 border border-white/8 rounded-[40px] p-8 space-y-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/10 rounded-xl"><Phone className="h-5 w-5 text-blue-400" /></div>
                <h2 className="text-lg font-black text-white uppercase italic">Contato & Endereço</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="E-mail" id="email" type="email" placeholder="seu@email.com" required />
                <Field label="WhatsApp / Celular" id="celular" type="tel" placeholder="(11) 99999-9999" required />
                <Field label="Telefone Fixo" id="telefone" type="tel" placeholder="(11) 3333-3333" />
                <Separator className="bg-white/5 md:col-span-2" />
                <Field label="CEP" id="cep" placeholder="00000-000" />
                <Select label="Estado (UF)" id="uf" options={['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']} />
                <Field label="Cidade" id="cidade" placeholder="São Paulo" />
                <Field label="Bairro" id="bairro" placeholder="Centro" />
                <Field label="Endereço" id="endereco" placeholder="Rua das Flores, 123" className="md:col-span-2" />
                <Separator className="bg-white/5 md:col-span-2" />
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black md:col-span-2">Contato de Emergência</p>
                <Field label="Nome do Contato" id="emergencia_nome" placeholder="Nome completo" />
                <Field label="Telefone de Emergência" id="emergencia_tel" type="tel" placeholder="(11) 99999-9999" />
              </div>
            </motion.div>
          )}

          {/* STEP 3 — DADOS CLÍNICOS */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-white/3 border border-white/8 rounded-[40px] p-8 space-y-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-500/10 rounded-xl"><HeartPulse className="h-5 w-5 text-red-400" /></div>
                <h2 className="text-lg font-black text-white uppercase italic">Dados Clínicos</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Select label="Tipo Sanguíneo" id="sangue" options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Não sei']} />
                <Field label="Peso (kg)" id="peso" type="number" placeholder="70" />
                <Field label="Altura (cm)" id="altura" type="number" placeholder="170" />
                <Select label="Fumante?" id="fumante" options={['Não', 'Sim', 'Ex-fumante']} />
                <Select label="Consome Álcool?" id="alcool" options={['Não', 'Socialmente', 'Frequentemente', 'Ex-consumidor']} />
                <Select label="Pratica Atividade Física?" id="atividade" options={['Não pratico', '1-2x por semana', '3-4x por semana', 'Diariamente']} />
                <Textarea label="Alergias Conhecidas" id="alergias" placeholder="Penicilina, látex, dipirona..." className="md:col-span-2" />
                <Textarea label="Doenças Preexistentes / CID" id="doencas" placeholder="Hipertensão (I10), Diabetes tipo 2 (E11)..." className="md:col-span-2" />
                <Textarea label="Medicamentos em Uso" id="medicamentos" placeholder="Nome do medicamento, dose e frequência..." className="md:col-span-2" />
                <Textarea label="Cirurgias Anteriores" id="cirurgias" placeholder="Apendicectomia (2015), Laparoscopia (2020)..." className="md:col-span-2" />
                <Textarea label="Histórico Familiar Relevante" id="historico" placeholder="Pai: infarto. Mãe: diabetes tipo 1..." className="md:col-span-2" />
              </div>
            </motion.div>
          )}

          {/* STEP 4 — CONSENTIMENTO */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-white/3 border border-white/8 rounded-[40px] p-8 space-y-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-teal-500/10 rounded-xl"><ShieldCheck className="h-5 w-5 text-teal-400" /></div>
                <h2 className="text-lg font-black text-white uppercase italic">Consentimento & Privacidade</h2>
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300 leading-relaxed">
                  <span className="text-amber-400 font-bold">Importante:</span> Leia com atenção antes de prosseguir. Os termos abaixo são obrigatórios para uso da plataforma Nexus Health.
                </p>
              </div>

              {[
                {
                  key: 'ai' as const,
                  title: 'Uso de IA para Análise de Imagens Médicas',
                  desc: 'Autorizo o Nexus Health a utilizar modelos de inteligência artificial (AWS Bedrock / Claude Vision) para analisar minhas imagens médicas. Compreendo que os resultados são laudos PRELIMINARES de suporte, não substituindo avaliação médica profissional.',
                  required: true,
                },
                {
                  key: 'data' as const,
                  title: 'Tratamento de Dados de Saúde (LGPD Art. 11)',
                  desc: 'Autorizo o tratamento dos meus dados pessoais e dados sensíveis de saúde pela Nexus Intelligence conforme a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). Meus dados serão armazenados de forma criptografada e não serão comercializados.',
                  required: true,
                },
                {
                  key: 'share' as const,
                  title: 'Compartilhamento com Profissional de Saúde',
                  desc: 'Autorizo que os laudos gerados pelo Nexus Health possam ser compartilhados com médicos ou profissionais de saúde indicados por mim, mediante minha solicitação expressa.',
                  required: false,
                },
              ].map((item) => (
                <label key={item.key} className={cn(
                  'flex gap-4 p-5 rounded-2xl border cursor-pointer transition-all',
                  consents[item.key]
                    ? 'border-teal-500/40 bg-teal-500/5'
                    : 'border-white/8 bg-white/2 hover:border-white/15'
                )}>
                  <div className="flex-shrink-0 mt-0.5">
                    <div
                      onClick={() => setConsents(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                      className={cn(
                        'w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer',
                        consents[item.key] ? 'bg-teal-500 border-teal-500' : 'border-white/20'
                      )}
                    >
                      {consents[item.key] && <CheckCircle className="h-3 w-3 text-white" />}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-white flex items-center gap-2">
                      {item.title}
                      {item.required && <span className="text-[9px] bg-teal-600 text-white px-2 py-0.5 rounded-full font-black uppercase">Obrigatório</span>}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </label>
              ))}

              <div className="flex items-start gap-3 bg-blue-500/5 border border-blue-500/15 rounded-2xl p-4">
                <Lock className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Seus dados são protegidos por criptografia AES-256. Servidores localizados no Brasil (AWS São Paulo). Você pode solicitar exclusão de dados a qualquer momento via <span className="text-blue-400">privacidade@nexus.ai</span>.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NAVIGATION */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handleBack}
            disabled={step === 1}
            variant="outline"
            className="border-white/10 text-slate-400 hover:text-white font-black uppercase tracking-widest gap-2 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" /> Voltar
          </Button>

          <div className="flex items-center gap-2">
            {steps.map((s) => (
              <div key={s.id} className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                step === s.id ? 'w-6 bg-teal-400' : step > s.id ? 'w-3 bg-teal-500/50' : 'w-3 bg-white/10'
              )} />
            ))}
          </div>

          {step < steps.length ? (
            <Button onClick={handleNext} className="bg-teal-600 hover:bg-teal-500 text-white font-black uppercase tracking-widest gap-2">
              Avançar <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!consents.ai || !consents.data}
              className="bg-teal-600 hover:bg-teal-500 text-white font-black uppercase tracking-widest gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CheckCircle className="h-4 w-4" /> Criar Perfil
            </Button>
          )}
        </div>

        {/* FOOTER INFO */}
        <p className="text-center text-[10px] text-slate-600 uppercase tracking-widest font-black">
          Nexus Health · LGPD Compliant · Dados Criptografados · AWS São Paulo
        </p>
      </div>
    </div>
  );
}
