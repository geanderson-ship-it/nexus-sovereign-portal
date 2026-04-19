'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, X, Mail, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { firestore } = useFirestore() as any;
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se já foi mostrado nesta sessão
    const storageKey = 'nexus_exit_popup_shown';
    if (sessionStorage.getItem(storageKey)) {
        setHasShown(true);
        return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (hasShown) return;
      
      // Se o mouse sair pelo topo da página (onde fecha a aba)
      if (e.clientY <= 0) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem(storageKey, 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firestore) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'leads'), {
        email,
        source: 'exit_intent_popup',
        timestamp: new Date().toISOString(),
        status: 'pending_manual_contact',
        assignedTo: 'geanderson@nexustreinamento.com'
      });

      toast({
        title: "Acesso de Elite Solicitado!",
        description: "A Maga está preparando seu Manual Tático. Verifique seu e-mail em breve.",
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving lead:', error);
      toast({
        variant: "destructive",
        title: "Erro de Conexão",
        description: "Não conseguimos registrar sua solicitação. Tente novamente ou fale no WhatsApp.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[500px] p-0 border-primary/50 overflow-hidden bg-black text-white">
        <div className="relative">
            {/* Header Visual */}
            <div className="relative h-48 w-full">
                <Image 
                    src="/maga-avatar-premium.png" 
                    alt="Maga Dot" 
                    fill 
                    className="object-cover object-top opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute top-4 left-4">
                    <span className="bg-primary/20 border border-primary text-primary text-[10px] font-bold px-2 py-1 rounded tracking-[0.2em] uppercase">
                        Protocolo de Resgate
                    </span>
                </div>
            </div>

            <div className="p-8 space-y-6">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-3xl font-headline font-bold flex items-center gap-2">
                        <Sparkles className="text-primary h-6 w-6 animate-pulse" />
                        Aguarde, Comandante!
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 text-lg">
                        Você está prestes a sair sem o seu **Manual de Inteligência Tática**. 
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl space-y-3">
                    <div className="flex items-start gap-3">
                        <ShieldCheck className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <p className="text-sm">Vou te enviar o bônus: **"As 5 Fases da Escala Nexus"** totalmente grátis.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input 
                            type="email" 
                            placeholder="Seu e-mail de elite..." 
                            className="bg-white/5 border-white/10 pl-10 h-12 focus:border-primary transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full h-12 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 btn-glow-pulse"
                    >
                        {isSubmitting ? "Sincronizando..." : "RECEBER MEU MANUAL GRATUITO"}
                    </Button>
                </form>

                <p className="text-center text-[10px] text-gray-500 uppercase tracking-widest">
                    Sem spam. Apenas inteligência pura.
                </p>
            </div>

            <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
                <X className="h-5 w-5 text-gray-400" />
            </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
