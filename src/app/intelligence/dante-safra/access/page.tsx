'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn, generatePixPayload } from '@/lib/utils';
import { ArrowLeft, ScanLine, Copy, Check, MessageSquare, ShieldCheck, Zap, Wheat, CloudRain } from 'lucide-react';
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

export default function DanteSafraAccessPage() {
  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isPayloadCopied, setIsPayloadCopied] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(1500);
  const { toast } = useToast();
  
  const plans = [
    { id: 'standard_monthly', amount: 99, tier: 'Standard', label: 'Mensal', description: 'Manutenção e Suporte' },
    { id: 'standard_annual', amount: 999, tier: 'Standard', label: 'Anual', description: 'Cota de Acesso Total' },
    { id: 'axis_monthly', amount: 149, tier: 'Axis', label: 'Mensal', description: 'Terminal Tático Elite' },
    { id: 'axis_annual', amount: 1500, tier: 'Axis', label: 'Anual', description: 'Comando Estratégico Total' }
  ];

  const selectedPlan = plans.find(p => p.amount === selectedAmount) || plans[3];

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

  const whatsappMessage = `Olá! Efetuei o pagamento de R$ ${selectedAmount.toFixed(2).replace('.',',')} para o acesso ao Dante Safra (${selectedPlan.tier} - ${selectedPlan.label}) e estou enviando o comprovante.`;
  const whatsappUrl = `https://wa.me/5551999799582?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="flex flex-col min-h-screen items-center text-white py-12 px-4 bg-[#020617] relative">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 rounded-full blur-[150px]" />
      </div>

      <Dialog open={showQrModal} onOpenChange={setShowQrModal}>
        <DialogContent className="bg-white p-4 max-w-xs z-50">
          <DialogHeader>
            <DialogTitle className="text-center text-black">PIX - Dante Safra {selectedPlan.tier}</DialogTitle>
            <DialogDescription className="text-center">
              Plano {selectedPlan.label} - R$ {selectedAmount.toFixed(2).replace('.', ',')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-4">
            <QrCode value={pixPayload} size={256} />
          </div>
          <div className="mt-2 text-center">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
              Nexus Inteligência • Caixa Federal
            </span>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="w-full max-w-6xl relative z-10">
        <div className="flex items-center gap-6 mb-12">
          <Link href="/intelligence">
            <div className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/10">
              <ArrowLeft className="h-6 w-6 text-emerald-400" />
            </div>
          </Link>
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white font-headline uppercase italic">
              CONTRATAÇÃO <span className="text-emerald-500 underline decoration-emerald-500/30 underline-offset-8">DANTE SAFRA</span>
            </h1>
            <p className="text-gray-400 mt-2 font-medium tracking-widest uppercase text-xs">
              Selecione o nível de comando para sua operação
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-16">
          {/* STANDARD TIER - ESSENTIAL ACCESS */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            <Card className="bg-slate-900/20 border-blue-500/20 backdrop-blur-xl overflow-hidden rounded-[32px] group transition-opacity">
              <div className="relative h-64 overflow-hidden transition-all duration-700">
                <Image 
                  src="https://i.postimg.cc/FF8yZyFQ/dante-safra.jpg"
                  alt="Dante Safra Standard"
                  fill
                  className="object-contain p-6 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-slate-950/40" />
                <div className="absolute top-6 left-6">
                  <Badge className="bg-blue-600/50 text-white border-white/10 px-4 py-2 text-[10px] font-black tracking-[0.2em] uppercase">STANDARD_ACCESS</Badge>
                </div>
              </div>
              <CardHeader className="pt-8">
                <CardTitle className="text-3xl font-bold text-white font-headline uppercase tracking-tight">Dante Safra Standard</CardTitle>
                <CardDescription className="text-slate-400 text-sm leading-relaxed mt-2">
                  O essencial para o campo digital. Inclui acompanhamento climático especializado e inteligência de mercado direto nas principais bolsas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    onClick={() => { setSelectedAmount(999); setShowPaymentPanel(false); }}
                    className={cn(
                      "p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden",
                      selectedAmount === 999 
                        ? "bg-blue-500/20 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)] scale-[1.02]" 
                        : "bg-white/5 border-white/10 hover:border-blue-500/50"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                       <p className="text-[10px] uppercase font-black tracking-[0.2em] text-blue-400">PLANO ANUAL</p>
                       {selectedAmount === 999 && <Check className="h-4 w-4 text-blue-400" />}
                    </div>
                    <p className="text-3xl font-bold text-white tracking-tighter">R$ 999 <span className="text-xs font-medium text-slate-500">/ano</span></p>
                    <p className="text-[9px] text-zinc-500 mt-2">Acesso Básico Total</p>
                  </div>

                  <div 
                    onClick={() => { setSelectedAmount(99); setShowPaymentPanel(false); }}
                    className={cn(
                      "p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden",
                      selectedAmount === 99 
                        ? "bg-blue-500/20 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)] scale-[1.02]" 
                        : "bg-white/5 border-white/10 hover:border-blue-500/50"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                       <p className="text-[10px] uppercase font-black tracking-[0.2em] text-blue-400">PLANO MENSAL</p>
                       {selectedAmount === 99 && <Check className="h-4 w-4 text-blue-400" />}
                    </div>
                    <p className="text-3xl font-bold text-white tracking-tighter">R$ 99 <span className="text-xs font-medium text-slate-500">/mês</span></p>
                    <p className="text-[9px] text-zinc-500 mt-2">Suporte Essencial</p>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <div className="flex items-center gap-3 text-xs text-slate-500 border-l border-blue-500/20 pl-4">
                    <CloudRain className="h-4 w-4 text-blue-400" />
                    <span>Acompanhamento climático completo</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 border-l border-blue-500/20 pl-4">
                    <Wheat className="h-4 w-4 text-blue-400" />
                    <span>Cotações B3 e Chicago em tempo real</span>
                  </div>
                  <Button asChild variant="link" className="text-emerald-400/70 hover:text-emerald-400 font-bold uppercase tracking-[0.2em] text-[9px] p-0 h-auto">
                    <Link href="/intelligence/dante-safra/trial">
                      Ou, testar grátis por 1 hora
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AXIS PREMIUM - ELITE TIER */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <Card className="bg-slate-900/40 border-emerald-500/30 backdrop-blur-3xl overflow-hidden rounded-[32px] shadow-[0_0_50px_rgba(16,185,129,0.1)] group">
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src="https://i.postimg.cc/65ZnxtG5/Dante-safra-axis.png"
                  alt="Dante Safra Axis"
                  fill
                  className="object-contain transition-transform duration-[2s] group-hover:scale-105 p-6"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="absolute top-6 left-6">
                  <Badge className="bg-emerald-600 text-white border-none px-4 py-2 text-[10px] font-black tracking-[0.2em] uppercase shadow-2xl">AXIS_ELITE_TERMINAL</Badge>
                </div>
              </div>
              <CardHeader className="pt-8">
                <CardTitle className="text-3xl font-black italic text-emerald-400 font-headline uppercase tracking-tighter">Dante Safra Axis</CardTitle>
                <CardDescription className="text-slate-300 text-sm leading-relaxed mt-2 opacity-80">
                  O auge da tecnologia tática. Inclui visão computacional, análise multiespectral de solo e o Centro de Comando completo com IA Estratégica.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    onClick={() => { setSelectedAmount(1500); setShowPaymentPanel(false); }}
                    className={cn(
                      "p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden",
                      selectedAmount === 1500 
                        ? "bg-emerald-500/20 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] scale-[1.02]" 
                        : "bg-white/5 border-white/10 hover:border-emerald-500/50"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                       <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500">PLANO ANUAL</p>
                       {selectedAmount === 1500 && <Check className="h-4 w-4 text-emerald-500" />}
                    </div>
                    <p className="text-3xl font-black text-white italic">R$ 1.500 <span className="text-xs font-medium not-italic text-slate-400">/ano</span></p>
                    <p className="text-[9px] text-zinc-500 mt-2">Pagamento único via PIX</p>
                  </div>

                  <div 
                    onClick={() => { setSelectedAmount(149); setShowPaymentPanel(false); }}
                    className={cn(
                      "p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden",
                      selectedAmount === 149 
                        ? "bg-emerald-500/20 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] scale-[1.02]" 
                        : "bg-white/5 border-white/10 hover:border-emerald-500/50"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                       <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500">PLANO MENSAL</p>
                       {selectedAmount === 149 && <Check className="h-4 w-4 text-emerald-500" />}
                    </div>
                    <p className="text-3xl font-black text-white italic">R$ 149 <span className="text-xs font-medium not-italic text-slate-400">/mês</span></p>
                    <p className="text-[9px] text-zinc-500 mt-2">Suporte e Manutenção AXIS</p>
                  </div>
                </div>
                
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-400 border-l border-emerald-500/30 pl-4">
                    <Zap className="h-4 w-4 text-emerald-400" />
                    <span>Aumento de até 65% na produtividade final</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 border-l border-emerald-500/30 pl-4">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>Monitoramento Tático em Tempo Real</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* PAYMENT ACTION AREA */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="max-w-2xl mx-auto"
        >
          <Card className="bg-emerald-500/10 border-emerald-500/30 backdrop-blur-3xl rounded-[32px] p-8 border-dashed border-2">
            {!showPaymentPanel ? (
              <div className="text-center space-y-6">
                <p className="text-sm font-medium tracking-widest text-emerald-400 uppercase">
                  Você selecionou: Dante Safra {selectedPlan.tier} ({selectedPlan.label})
                </p>
                <div className="flex items-baseline justify-center gap-2">
                   <span className="text-sm text-slate-400">Valor à vista:</span>
                   <span className="text-5xl font-black italic text-white font-headline tracking-tighter">R$ {selectedAmount.toFixed(2).replace('.', ',')}</span>
                </div>
                <Button 
                  className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-2xl transition-all hover:scale-[1.02]" 
                  onClick={() => setShowPaymentPanel(true)}
                >
                  <ScanLine className="mr-3 h-6 w-6" />
                  Liberar Acesso via PIX
                </Button>
              </div>
            ) : (
              <div className="w-full space-y-6 animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between">
                   <h3 className="text-xl font-bold uppercase tracking-tight text-white">Métodos de Pagamento</h3>
                   <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">TERMINAL_SECURE_PAY</Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button className="h-14 font-black bg-white text-black hover:bg-emerald-50 hover:text-emerald-700 rounded-xl" onClick={() => setShowQrModal(true)}>
                    <ScanLine className="mr-2 h-5 w-5" />
                    Pagar com QR Code
                  </Button>
                  <Button variant="secondary" className="h-14 font-bold bg-slate-800 hover:bg-slate-700 border-white/5 rounded-xl" onClick={handleCopyPayload}>
                    {isPayloadCopied ? <Check className="mr-2 h-4 w-4 text-emerald-400" /> : <Copy className="mr-2 h-4 w-4" />}
                    {isPayloadCopied ? 'Copiado!' : 'Copia e Cola'}
                  </Button>
                </div>
                
                <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-500 h-14 rounded-xl shadow-xl">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Enviar Comprovante de Ativação
                  </a>
                </Button>
                
                <Button variant="ghost" className="w-full text-slate-400 hover:text-white" onClick={() => setShowPaymentPanel(false)}>
                  Alterar Seleção de Plano
                </Button>
              </div>
            )}
          </Card>

          <div className="text-center mt-12 mb-20 space-y-4">
            <p className="text-slate-600 text-[9px] uppercase tracking-widest leading-relaxed">
              *A ativação é imediata após a confirmação do pagamento via terminal.<br />
              Todos os impostos inclusos. Licença individual intransferível.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
