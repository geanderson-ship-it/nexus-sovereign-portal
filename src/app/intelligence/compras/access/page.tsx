
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn, generatePixPayload } from '@/lib/utils';
import { ArrowLeft, ScanLine, Copy, Check, MessageSquare } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

const QrCode = dynamic(() => import('@/components/ui/qr-code').then(mod => mod.QrCode), {
  ssr: false,
  loading: () => <Skeleton className="w-[256px] h-[256px] rounded-lg" />,
});

export default function DanteComprasAccessPage() {
  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isPayloadCopied, setIsPayloadCopied] = useState(false);
  const { toast } = useToast();
  
  const moduleDetails = {
    title: "Dante Compras - Acesso Total",
    cotaUnica: 1500,
    manutencao: 150,
  };

  const pixPayload = useMemo(() => {
    return generatePixPayload({
        amount: moduleDetails.cotaUnica,
        txid: '***',
    });
  }, [moduleDetails.cotaUnica]);

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(pixPayload);
    setIsPayloadCopied(true);
    toast({ title: 'Código PIX Copia e Cola copiado!' });
    setTimeout(() => setIsPayloadCopied(false), 2000);
  }

  const whatsappMessage = `Olá! Efetuei o pagamento de R$ ${moduleDetails.cotaUnica.toFixed(2).replace('.',',')} para o acesso total ao módulo Dante Compras e estou enviando o comprovante.`;
  const whatsappUrl = `https://wa.me/5551999799582?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="flex flex-col h-full items-center justify-center text-white py-8">
      <Dialog open={showQrModal} onOpenChange={setShowQrModal}>
        <DialogContent className="bg-white p-4 max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-center text-black">PIX para Acesso Total.</DialogTitle>
            <DialogDescription className="text-center">
              Escaneie o código com seu app de banco.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-4">
            <QrCode value={pixPayload} size={256} />
          </div>
          <p className="text-center text-black font-bold">Valor: R$ {moduleDetails.cotaUnica.toFixed(2).replace('.', ',')}</p>
          <div className="mt-2 text-center">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
              Caixa Federal • Venâncio Aires/RS
            </span>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="w-full max-w-md">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/intelligence">
            <ArrowLeft className="h-6 w-6 hover:text-blue-400 transition-colors" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-blue-300 font-headline">
              Módulo Dante Compras.
            </h1>
            <p className="text-lg text-gray-400">
              Inteligência de suprimentos e negociação.
            </p>
          </div>
        </div>

        <Card className="bg-gray-900/50 border-blue-700/50">
          <CardHeader>
            <CardTitle className="text-blue-400 font-headline">Plano de Acesso Total.</CardTitle>
            <CardDescription>Invista na inteligência que multiplica resultados em suas compras.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-white">R$ {moduleDetails.cotaUnica.toFixed(2).replace('.', ',')}</p>
              <p className="text-sm text-muted-foreground">Cota Única de Acesso Vitalício</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">R$ {moduleDetails.manutencao.toFixed(2).replace('.', ',')}<span className="text-base">/mês</span></p>
              <p className="text-sm text-muted-foreground">Manutenção e Atualizações da IA</p>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            {!showPaymentPanel ? (
              <Button className="w-full bg-blue-600 hover:bg-blue-500" onClick={() => setShowPaymentPanel(true)}>
                Contratar Acesso Total
              </Button>
            ) : (
              <div className="w-full space-y-3 text-left animate-in fade-in-0">
                <Button className="w-full h-12 font-bold bg-blue-600 hover:bg-blue-500" onClick={() => setShowQrModal(true)}>
                  <ScanLine className="mr-2 h-5 w-5" />
                  Pagar com QR Code
                </Button>
                <Button variant="secondary" className="w-full" onClick={handleCopyPayload}>
                  {isPayloadCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  {isPayloadCopied ? 'Copiado!' : 'PIX Copia e Cola'}
                </Button>
                <Button asChild className="w-full bg-green-600 hover:bg-green-700 h-11">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Enviar Comprovante
                  </a>
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
        <div className="text-center mt-6">
            <Button asChild variant="link" className="text-blue-400">
                <Link href="/intelligence/compras/trial">
                    Ou, testar por 24 horas grátis.
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
