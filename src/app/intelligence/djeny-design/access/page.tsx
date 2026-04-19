'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn, generatePixPayload } from '@/lib/utils';
import { ArrowLeft, ScanLine, Copy, Check, MessageSquare, Zap, Target, TrendingUp, History, Image as ImageIcon, Sparkles, Building2, User } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const QrCode = dynamic(() => import('@/components/ui/qr-code').then(mod => mod.QrCode), {
  ssr: false,
  loading: () => <Skeleton className="w-[256px] h-[256px] rounded-lg" />,
});

export default function DjenyDesignAccessPage() {
  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isPayloadCopied, setIsPayloadCopied] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(899);
  const { toast } = useToast();
  
  const plans = [
    { id: 'personal', amount: 149, tier: 'Personal', label: 'Mensal', description: '3 imagens por dia', icon: User, color: 'pink' },
    { id: 'business', amount: 899, tier: 'Business', label: 'Mensal', description: 'Geração Ilimitada', icon: Building2, color: 'pink' }
  ];

  const selectedPlan = plans.find(p => p.amount === selectedAmount) || plans[1];

  const pixPayload = useMemo(() => {
    return generatePixPayload({
        amount: selectedAmount,
        txid: '***',
    });
  }, [selectedAmount]);

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(pixPayload);
    setIsPayloadCopied(true);
    toast({ title: 'Código PIX Copia e Cola copiado!' });
    setTimeout(() => setIsPayloadCopied(false), 2000);
  }

  const whatsappMessage = `Olá! Efetuei o pagamento de R$ ${selectedAmount.toFixed(2).replace('.',',')} para o acesso ao Djeny Design (${selectedPlan.tier}) e estou enviando o comprovante.`;
  const whatsappUrl = `https://wa.me/5551999799582?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="flex flex-col min-h-screen items-center text-white py-12 px-4 bg-[#020617] relative">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[150px]" />
      </div>

      <Dialog open={showQrModal} onOpenChange={setShowQrModal}>
        <DialogContent className="bg-white p-4 max-w-xs z-50">
          <DialogHeader>
            <DialogTitle className="text-center text-black font-black uppercase tracking-tight italic">PIX - Djeny {selectedPlan.tier}</DialogTitle>
            <DialogDescription className="text-center font-medium">
              Valor: R$ {selectedAmount.toFixed(2).replace('.', ',')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-4">
            <QrCode value={pixPayload} size={256} />
          </div>
          <div className="mt-2 text-center">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
              Nexus Holding • Operação Djeny
            </span>
          </div>
        </DialogContent>
      </Dialog>

      <div className="w-full max-w-6xl relative z-10">
        <div className="flex items-center gap-6 mb-16">
          <Link href="/intelligence">
            <div className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/10">
              <ArrowLeft className="h-6 w-6 text-pink-400" />
            </div>
          </Link>
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white font-headline uppercase italic leading-none">
              PLANO DE <span className="text-pink-500">AMBIENTAÇÃO</span>
            </h1>
            <p className="text-gray-400 mt-2 font-medium tracking-widest uppercase text-xs">
              Escolha seu nível de produtividade criativa
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* PERSONAL TIER */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex">
            <Card className={cn(
              "flex flex-col w-full bg-slate-900/30 border-pink-500/10 backdrop-blur-3xl overflow-hidden rounded-[40px] group transition-all",
              selectedAmount === 149 && "border-pink-500/40 shadow-[0_0_40px_rgba(219,39,119,0.1)] bg-slate-900/50"
            )}>
              <div className="relative h-64 overflow-hidden grayscale-0">
                <Image 
                  src="/images/djeny/standard_hero.png"
                  alt="Djeny Design Personal"
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6">
                  <Badge className="bg-pink-600/50 text-white border-none px-4 py-1.5 text-[8px] font-black tracking-widest uppercase">INDIVIDUAL_ACCESS</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-3xl font-black text-white italic uppercase tracking-tighter">Djeny Personal</CardTitle>
                <CardDescription className="text-slate-400">Ideal para design pessoal e validação de conceitos.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-6">
                 <div 
                    onClick={() => { setSelectedAmount(149); setShowPaymentPanel(false); }}
                    className={cn(
                      "p-6 rounded-3xl border transition-all cursor-pointer group relative overflow-hidden",
                      selectedAmount === 149 
                        ? "bg-pink-500/10 border-pink-500/50 shadow-inner" 
                        : "bg-white/5 border-white/5 hover:border-pink-500/30"
                    )}
                 >
                    <div className="flex justify-between items-start mb-2">
                       <p className="text-[10px] uppercase font-black tracking-widest text-pink-400">ASSINATURA MENSAL</p>
                       {selectedAmount === 149 && <Check className="h-4 w-4 text-pink-400" />}
                    </div>
                    <p className="text-4xl font-black text-white italic">R$ 149 <span className="text-xs font-medium not-italic text-slate-500">/mês</span></p>
                    <div className="mt-4 space-y-2">
                       <div className="flex items-center gap-2 text-xs text-slate-300">
                          <ImageIcon className="h-3.5 w-3.5 text-pink-500" />
                          <span>3 gerações de imagem/dia</span>
                       </div>
                       <div className="flex items-center gap-2 text-xs text-slate-300">
                          <History className="h-3.5 w-3.5 text-pink-500" />
                          <span>Histórico de 30 dias</span>
                       </div>
                    </div>
                 </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* BUSINESS TIER */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex">
            <Card className={cn(
              "flex flex-col w-full bg-slate-900/40 border-pink-500/20 backdrop-blur-3xl overflow-hidden rounded-[40px] group transition-all",
              selectedAmount === 899 && "border-pink-500/60 shadow-[0_0_60px_rgba(219,39,119,0.2)] bg-slate-900/70"
            )}>
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src="/images/djeny/business_hero.png"
                  alt="Djeny Design Business"
                  fill
                  className="object-contain p-6 group-hover:scale-105 transition-transform duration-[2s]"
                />
                <div className="absolute top-6 left-6">
                  <Badge className="bg-pink-600 text-white border-none px-4 py-1.5 text-[8px] font-black tracking-widest uppercase shadow-xl animate-pulse">BUSINESS_ELITE</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-3xl font-black text-pink-500 italic uppercase tracking-tighter">Djeny Business</CardTitle>
                <CardDescription className="text-slate-300 opacity-80">Potencialize suas vendas corporativas com escala infinita.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-6">
                 <div 
                    onClick={() => { setSelectedAmount(899); setShowPaymentPanel(false); }}
                    className={cn(
                      "p-6 rounded-3xl border transition-all cursor-pointer group relative overflow-hidden",
                      selectedAmount === 899 
                        ? "bg-pink-500/20 border-pink-500 shadow-inner" 
                        : "bg-white/5 border-white/5 hover:border-pink-500/50"
                    )}
                 >
                    <div className="flex justify-between items-start mb-2">
                       <p className="text-[10px] uppercase font-black tracking-widest text-pink-400">ASSINATURA ILIMITADA</p>
                       {selectedAmount === 899 && <Check className="h-4 w-4 text-pink-400 font-black" />}
                    </div>
                    <p className="text-4xl font-black text-white italic">R$ 899 <span className="text-xs font-medium not-italic text-slate-500">/mês</span></p>
                    <div className="mt-4 space-y-2">
                       <div className="flex items-center gap-2 text-xs text-white font-bold">
                          <Zap className="h-4 w-4 text-pink-400 animate-pulse" />
                          <span>Gerações ILIMITADAS</span>
                       </div>
                       <div className="flex items-center gap-2 text-xs text-slate-300">
                          <Building2 className="h-3.5 w-3.5 text-pink-500" />
                          <span>Suporte Consultivo Prioritário</span>
                       </div>
                       <div className="flex items-center gap-2 text-xs text-slate-300">
                          <Target className="h-3.5 w-3.5 text-pink-500" />
                          <span>Foco em ROI e Vendas Corporativas</span>
                       </div>
                    </div>
                 </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* COMPARISON ROI TABLE */}
        <div className="mb-24">
            <h3 className="text-center text-xl font-black uppercase tracking-[0.4em] mb-12 text-slate-500 italic opacity-50">Comparativo de Eficiência (ROI)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center bg-white/5 rounded-[48px] p-10 border border-white/5 backdrop-blur-3xl shadow-3xl">
                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Custos Médios</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-red-500/5 rounded-2xl">
                           <p className="text-[9px] uppercase font-bold text-red-400 mb-1">Tradicional</p>
                           <p className="text-lg font-black text-white">R$ 2.000+</p>
                           <p className="text-[8px] text-slate-500 italic">por projeto</p>
                        </div>
                        <div className="p-4 bg-emerald-500/5 rounded-2xl">
                           <p className="text-[9px] uppercase font-bold text-emerald-400 mb-1">Djeny AI</p>
                           <p className="text-lg font-black text-white">R$ 149</p>
                           <p className="text-[8px] text-slate-500 italic">por mês</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tempo de Entrega</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-red-500/5 rounded-2xl">
                           <p className="text-[9px] uppercase font-bold text-red-400 mb-1">Tradicional</p>
                           <p className="text-lg font-black text-white">7 a 15 Dias</p>
                        </div>
                        <div className="p-4 bg-emerald-500/5 rounded-2xl">
                           <p className="text-[9px] uppercase font-bold text-emerald-400 mb-1">Djeny AI</p>
                           <p className="text-lg font-black text-white">Segundos</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Conversão em Vendas</p>
                    <div className="p-6 bg-pink-500/10 rounded-2xl border border-pink-500/20">
                        <div className="flex items-center justify-center gap-2 text-pink-400 mb-1">
                           <TrendingUp className="h-4 w-4" />
                           <p className="text-2xl font-black text-white">+40%</p>
                        </div>
                        <p className="text-[9px] uppercase font-bold text-pink-400 italic tracking-tighter">Aumento Real no Fechamento</p>
                    </div>
                </div>
            </div>
            <p className="text-center text-[10px] text-slate-600 mt-8 tracking-widest uppercase">*Uma tecnologia exclusiva Nexus que redefine o padrão de apresentação de produtos.</p>
        </div>

        {/* PAYMENT BUTTON */}
        <div className="max-w-2xl mx-auto">
             <Card className="bg-pink-600/10 border-pink-500/30 backdrop-blur-3xl rounded-[40px] p-8 border-dashed border-2">
                {!showPaymentPanel ? (
                   <div className="text-center space-y-6">
                      <p className="text-xs font-bold tracking-[0.3em] text-pink-400 uppercase">
                         Assinatura Selecionada: Djeny {selectedPlan.tier}
                      </p>
                      <p className="text-5xl font-black text-white italic tracking-tighter">R$ {selectedAmount.toFixed(2).replace('.', ',')} <span className="text-sm not-italic opacity-40">/mês</span></p>
                      <Button 
                         className="w-full h-16 bg-pink-600 hover:bg-pink-500 text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-2xl transition-all" 
                         onClick={() => setShowPaymentPanel(true)}
                      >
                         <ScanLine className="mr-3 h-6 w-6" />
                         Contratar Assinatura via PIX
                      </Button>
                   </div>
                ) : (
                   <div className="space-y-6 animate-in zoom-in-95 duration-300">
                      <div className="flex items-center justify-between pb-2">
                         <h3 className="text-lg font-black uppercase text-white italic">Contratação Segura</h3>
                         <Badge variant="outline" className="border-pink-500/30 text-pink-400">SSL_ENCRYPTED</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <Button className="h-14 font-black bg-white text-black hover:bg-pink-50 rounded-xl" onClick={() => setShowQrModal(true)}>
                           <ScanLine className="mr-2 h-5 w-5 font-black" />
                           Gerar QR Code
                         </Button>
                         <Button variant="secondary" className="h-14 font-bold bg-slate-800 hover:bg-slate-700 border-white/5 rounded-xl text-xs" onClick={handleCopyPayload}>
                           {isPayloadCopied ? <Check className="mr-2 h-4 w-4 text-emerald-400" /> : <Copy className="mr-2 h-4 w-4" />}
                           {isPayloadCopied ? 'PIX Copiado!' : 'Copia e Cola'}
                         </Button>
                      </div>
                      
                      <Button asChild className="w-full bg-pink-600 hover:bg-pink-500 h-14 rounded-xl shadow-xl">
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                          <MessageSquare className="mr-2 h-5 w-5" />
                          Enviar Comprovante de Ativação
                        </a>
                      </Button>
                      
                      <Button variant="ghost" className="w-full text-slate-500 hover:text-white text-[10px] uppercase font-bold" onClick={() => setShowPaymentPanel(false)}>
                        Mudar Plano
                      </Button>
                   </div>
                )}
             </Card>
        </div>
      </div>
    </div>
  );
}
