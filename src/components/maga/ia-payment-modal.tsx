'use client';

import React, { useState, useMemo } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QrCode } from '@/components/ui/qr-code';
import { Check, Copy, ShieldCheck, Sparkles, Smartphone, Zap } from 'lucide-react';
import { cn, generatePixPayload } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface IAPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  iaName: string;
  pixKey: string;
  monthlyPrice?: string;
  annualPrice?: string;
  isSinglePrice?: boolean;
  singlePriceLabel?: string;
  onSuccess?: () => void;
}

export function IAPaymentModal({ 
  isOpen, 
  onClose, 
  iaName, 
  pixKey, 
  monthlyPrice = 'R$ 149,00', 
  annualPrice = 'R$ 1.500,00',
  isSinglePrice = false,
  singlePriceLabel = 'Pagamento Único',
  onSuccess 
}: IAPaymentModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const plans = {
    monthly: {
      price: monthlyPrice,
      label: 'Plano Mensal',
    },
    annual: {
      price: annualPrice,
      label: isSinglePrice ? singlePriceLabel : 'Plano Anual',
    }
  };

  // Converte a string "R$ 999,00" para número 999.00
  const currentPriceString = plans[selectedPlan].price;
  const amountNumeric = parseFloat(currentPriceString.replace('R$', '').trim().replace(/\./g, '').replace(',', '.'));
  
  // Gera o Payload PIX (Copia e Cola) - Memoizado para não mudar a cada render
  const fullPixPayload = useMemo(() => {
    return generatePixPayload({
      amount: isNaN(amountNumeric) ? 0 : amountNumeric,
      txid: 'NEX' + Date.now().toString().slice(-6)
    });
  }, [amountNumeric]);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(fullPixPayload);
    setCopied(true);
    toast({
      title: "Chave PIX Copiada!",
      description: "Cole no seu aplicativo do banco para finalizar.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[94vw] max-w-[420px] max-h-[92vh] bg-zinc-950 border-zinc-800 text-white p-0 overflow-y-auto shadow-[0_0_120px_rgba(0,0,0,1)] z-[9999] overflow-x-hidden">
        <div className="relative p-5 sm:p-6 w-full max-w-full">
          {/* Header Gradient */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-500" />
          
          <DialogHeader className="pt-4 text-center">
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <span className="bg-primary/20 text-primary border border-primary/30 rounded-full px-5 py-1 text-[11px] tracking-[0.3em] font-black uppercase">
                Premium Upgrade
              </span>
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-headline font-black tracking-tight text-white leading-tight break-words px-2">
              Nexus VIP: {iaName}
            </DialogTitle>
            <DialogDescription className="text-zinc-500 text-[13px] mt-3 px-2">
              Desbloqueie o potencial máximo da inteligência estratégica da Nexus.
            </DialogDescription>
          </DialogHeader>

          {/* Plan Selector (Vertical focus) */}
          <div className="flex flex-col gap-3 mt-8 p-1.5 bg-zinc-900/40 rounded-3xl border border-zinc-800/50 w-full max-w-full">
            {(isSinglePrice ? (['annual'] as const) : (['annual', 'monthly'] as const)).map((planKey) => (
              <button
                key={planKey}
                onClick={() => setSelectedPlan(planKey)}
                className={cn(
                  "relative flex items-center justify-between px-6 py-5 rounded-2xl transition-all duration-500 group",
                  selectedPlan === planKey 
                    ? "bg-zinc-800 text-white shadow-2xl ring-1 ring-white/10" 
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/20",
                  isSinglePrice && "cursor-default"
                )}
              >
                <div className="flex flex-col items-start translate-z-0">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    {plans[planKey].label}
                  </span>
                  <span className="text-xl font-bold font-mono tracking-tighter leading-none">
                    {plans[planKey].price}
                  </span>
                </div>
                {planKey === 'annual' && !isSinglePrice && (
                  <span className="px-3 py-1 bg-primary text-[9px] font-black rounded-full text-white tracking-[0.2em] shadow-lg shadow-primary/40">
                    -16% OFF
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Payment Section - PURE VERTICAL */}
          <div className="mt-8 flex flex-col items-center gap-8 bg-zinc-900/20 p-6 sm:p-8 rounded-[40px] border border-zinc-800/60 relative overflow-hidden w-full max-w-full">
            <div className="absolute inset-0 bg-blue-500/[0.03] pointer-events-none" />
            
            {/* QR Code */}
            <div className="flex flex-col items-center gap-5 relative z-10 w-full">
              <div className="bg-white p-4 rounded-[32px] shadow-[0_0_50px_rgba(255,255,255,0.08)] transition-transform duration-700 hover:scale-[1.05] inline-block">
                <QrCode value={fullPixPayload} size={160} />
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center mt-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">
                  <Smartphone className="h-3.5 w-3.5 text-blue-500" />
                  <span>Escaneie para pagar</span>
                </div>
                <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.1em] opacity-80 bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-700/30">
                  Caixa Federal • Venâncio Aires/RS
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="w-full space-y-8 relative z-10">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-emerald-400/80 bg-emerald-400/5 px-4 py-3 rounded-2xl border border-emerald-400/10 w-fit mx-auto">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Protocolo Seguro v2.5</span>
                </div>
              </div>

              <div className="space-y-4 w-full">
                <p className="text-[10px] text-zinc-600 uppercase font-black tracking-[0.4em] text-center">Pix Copia ou Cola</p>
                <div className="flex flex-col gap-3 w-full">
                  <div className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl text-[9px] sm:text-[10px] font-mono text-zinc-400 shadow-inner text-center break-all">
                    {fullPixPayload}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full h-14 border-zinc-800 bg-zinc-900 hover:bg-primary hover:border-primary hover:text-white transition-all shadow-xl rounded-2xl flex items-center justify-center gap-3 group text-[10px] font-black uppercase tracking-[0.2em] shrink-0"
                    onClick={handleCopyPix}
                  >
                    {copied ? (
                      <>
                        <Check className="h-5 w-5" /> Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-5 w-5 group-hover:scale-110 transition-transform" /> Copiar Chave Pix
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-black text-[11px] uppercase tracking-[0.3em] h-16 rounded-[28px] shadow-2xl shadow-primary/40 group transition-all overflow-hidden border-none cursor-pointer mt-4 transform active:scale-95">
                <span className="relative z-10">Finalizar no Aplicativo</span>
              </Button>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 opacity-40">
             <div className="flex gap-8">
               <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">
                  <Zap className="h-3.5 w-3.5 text-primary" /> Prioridade
               </div>
               <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Sincronia
               </div>
             </div>
          </div>
        </div>

        <div className="py-5 bg-zinc-950 text-center border-t border-zinc-900/50">
          <p className="text-[9px] text-zinc-800 uppercase tracking-[0.6em] font-mono">
            NEXUS INTELLIGENCE // SECURE_FLOW: BLINDADO // {new Date().toLocaleDateString()}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
