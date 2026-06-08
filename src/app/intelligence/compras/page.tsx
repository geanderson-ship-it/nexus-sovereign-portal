
'use client';

import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Layers,
  FileSignature,
  Trophy,
  AlertTriangle,
  Loader2,
  Phone,
  Mail,
  MessageSquare,
  ShoppingCart,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  BarChart,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Line,
  CartesianGrid,
} from 'recharts';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { analyzeQuotation } from '@/ai/flows/dante-quotation-flow';
import type { QuotationAnalysisOutput } from '@/ai/flows/dante-quotation-types';
import DanteComprasChat from '@/components/dante-compras-chat';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';

// Mock data for economy charts - to be replaced with real data later
const dailyEconomy = [
  { day: 'D-6', economy: 150 },
  { day: 'D-5', economy: 200 },
  { day: 'D-4', economy: 180 },
  { day: 'D-3', economy: 250 },
  { day: 'D-2', economy: 220 },
  { day: 'D-1', economy: 300 },
  { day: 'Hoje', economy: 280 },
];
const weeklyAccumulated = [
  { week: 'S-3', accumulated: 0 },
  { week: 'S-2', accumulated: 0 },
  { week: 'S-1', accumulated: 0 },
  { week: 'Atual', accumulated: 0 },
];
const monthlyAccumulated = [
  { month: 'M-5', accumulated: 0 },
  { month: 'M-4', accumulated: 0 },
  { month: 'M-3', accumulated: 0 },
  { month: 'M-2', accumulated: 0 },
  { month: 'M-1', accumulated: 0 },
  { month: 'Atual', accumulated: 0 },
];
interface AuditRecord {
  id: string;
  timestamp: string;
  quotationName: string;
  itemSpec: string;
  recommendedSupplier: string;
  chosenSupplier: string;
  costDifference: number;
  status: 'ALINHADO' | 'DIVERGENTE';
  hash: string;
}

const generateSimulatedHash = (data: string) => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return "NX-" + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0') + "-" + Math.floor(1000 + Math.random() * 9000);
};

const chartConfig = {
  economy: {
    label: 'Economia (R$)',
    color: 'hsl(140, 80%, 60%)',
  },
  accumulated: {
    label: 'Acumulado (R$)',
    color: 'hsl(160, 100%, 75%)',
  }
};

export default function DanteComprasDashboardPage() {
    const [isMounted, setIsMounted] = React.useState(false);
    const [quotationDialogOpen, setQuotationDialogOpen] = React.useState(false);
    const [quotationItemName, setQuotationItemName] = React.useState('');
    const [quotationItemSpec, setQuotationItemSpec] = React.useState('');
    const [quotationDelivery, setQuotationDelivery] = React.useState('');
    const [quotationPayment, setQuotationPayment] = React.useState('');
    const [isQuotationLoading, setIsQuotationLoading] = React.useState(false);
    const [quotationResult, setQuotationResult] = React.useState<QuotationAnalysisOutput | null>(null);
    const [quotationError, setQuotationError] = React.useState<string | null>(null);
    const [auditDecision, setAuditDecision] = React.useState<string | null>(null);
    const [isFromBuilder, setIsFromBuilder] = React.useState(false);
    const [auditLogs, setAuditLogs] = React.useState<AuditRecord[]>([]);
    const [lastDeviation, setLastDeviation] = React.useState<{
        quotationId: string;
        chosen: string;
        recommended: string;
        costDifference: number;
      } | null>(null);

    React.useEffect(() => {
        setIsMounted(true);
        if (typeof window !== 'undefined') {
            const savedLogs = localStorage.getItem('nexus_compras_audit_log');
            if (savedLogs) {
                try {
                    setAuditLogs(JSON.parse(savedLogs));
                } catch (e) {
                    console.error("Erro ao carregar logs de auditoria:", e);
                }
            }
        }
    }, []);

    const handleQuotationDialogClose = () => {
        setAuditDecision(null);
        setQuotationResult(null);
        setQuotationError(null);
        setIsQuotationLoading(false);
        setQuotationItemName('');
        setQuotationItemSpec('');
        setQuotationDelivery('');
        setQuotationPayment('');
      };
    
    // Detect context from Dante Builder
    React.useEffect(() => {
        const rawContext = localStorage.getItem('nexus_builder_quote_context');
        if (rawContext) {
            try {
                const context = JSON.parse(rawContext);
                setQuotationItemName(`PROJETO BUILDER: ${context.title}`);
                setIsFromBuilder(true);
                
                // Format materials into a readable list for the spec field
                if (context.materials && Array.isArray(context.materials)) {
                    const formattedSpecs = context.materials
                        .map((m: any) => `- ${m.item} (${m.quantity}): ${m.details}`)
                        .join('\n');
                    setQuotationItemSpec(formattedSpecs);
                }
                
                setQuotationDialogOpen(true);
                // Clear context after loading to avoid re-triggering on refresh
                localStorage.removeItem('nexus_builder_quote_context');
            } catch (e) {
                console.error("Erro ao carregar contexto do Builder:", e);
                localStorage.removeItem('nexus_builder_quote_context');
            }
        }
    }, [setQuotationDialogOpen, setQuotationItemName, setQuotationItemSpec]);
    
    
      const handleQuotationSubmit = async () => {
        if (!quotationItemName || !quotationItemSpec) {
            setQuotationError("O nome do item e a especificação são obrigatórios para a análise.");
            return;
        }
        setIsQuotationLoading(true);
        setQuotationError(null);
        setAuditDecision(null);
    
        try {
            const result = await analyzeQuotation({
                itemName: quotationItemName,
                itemSpec: quotationItemSpec,
                desiredDelivery: quotationDelivery,
                desiredPayment: quotationPayment,
            });
            setQuotationResult(result);
        } catch (e: any) {
            const errorMessage = e.message || "Ocorreu um erro desconhecido.";
            if (errorMessage.includes('502') || errorMessage.includes('Failed to fetch') || errorMessage.includes('Network')) {
                 setQuotationError("Conexão instável, mantendo últimos dados seguros.");
            } else {
                setQuotationError(errorMessage);
            }
        } finally {
            setIsQuotationLoading(false);
        }
      };
    
      const handleAuditDecision = (chosenSupplierName: string) => {
        setAuditDecision(chosenSupplierName);
    
        if (quotationResult) {
            const recommendedSupplierName = quotationResult.recommendedSupplierName;
            const isRecommended = chosenSupplierName === recommendedSupplierName;
            const recommendedSupplier = quotationResult.suppliers.find(s => s.name === recommendedSupplierName);
            const chosenSupplier = quotationResult.suppliers.find(s => s.name === chosenSupplierName);
            
            if (recommendedSupplier && chosenSupplier) {
                const costDifference = chosenSupplier.price - recommendedSupplier.price;
                
                if (!isRecommended) {
                    setLastDeviation({
                        quotationId: quotationItemName || "N/A",
                        chosen: chosenSupplier.name,
                        recommended: recommendedSupplier.name,
                        costDifference: costDifference,
                    });
                } else {
                    setLastDeviation(null);
                }

                const newRecord: AuditRecord = {
                    id: `AUDIT-${Date.now()}`,
                    timestamp: new Date().toLocaleString('pt-BR'),
                    quotationName: quotationItemName || "Cotação Sem Nome",
                    itemSpec: quotationItemSpec || "Sem especificação",
                    recommendedSupplier: recommendedSupplierName,
                    chosenSupplier: chosenSupplierName,
                    costDifference: costDifference,
                    status: isRecommended ? 'ALINHADO' : 'DIVERGENTE',
                    hash: generateSimulatedHash(`${Date.now()}-${quotationItemName}-${chosenSupplierName}-${costDifference}`),
                };

                setAuditLogs(prev => {
                    const updated = [newRecord, ...prev];
                    localStorage.setItem('nexus_compras_audit_log', JSON.stringify(updated));
                    return updated;
                });
            }
        }
      };

      const totalDeviationCost = React.useMemo(() => {
          return auditLogs
              .filter(log => log.status === 'DIVERGENTE')
              .reduce((sum, log) => sum + log.costDifference, 0);
      }, [auditLogs]);

      const computedEconomy = React.useMemo(() => {
          const baseEconomy = 15420.00;
          return baseEconomy + auditLogs
              .filter(log => log.status === 'ALINHADO')
              .reduce((sum, log) => sum + 350.00, 0);
      }, [auditLogs]);


    return (
        <SovereignShowcase moduleName="Compras" imagePath="/Nexus Empresas/Dante compras.jpg">
            <div className="space-y-8 text-left">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-blue-500/10 pb-6">
                <div className="flex items-center gap-4">
                    <Link href="/nexus-empresas">
                        <div className="p-2 rounded-full hover:bg-blue-500/10 transition-colors cursor-pointer">
                            <ArrowLeft className="h-5 w-5 text-blue-400" />
                        </div>
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tighter font-headline text-blue-300">
                            Dashboard Compras.
                        </h1>
                        <p className="text-xs text-gray-400">
                            Central de Operações de Suprimentos.
                        </p>
                    </div>
                </div>
                {isFromBuilder && (
                    <Link href="/intelligence/dante-builder">
                        <Button variant="outline" className="text-emerald-400 border-emerald-500/50 hover:bg-emerald-950/50 bg-black/50 h-9 text-xs">
                            <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                            Voltar para o Projeto Builder
                        </Button>
                    </Link>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Dialog open={quotationDialogOpen} onOpenChange={(isOpen) => {
                    setQuotationDialogOpen(isOpen);
                    if (!isOpen) {
                        handleQuotationDialogClose();
                    }
                }}>
                    <DialogTrigger asChild>
                         <Card className="bg-gray-900/50 border-blue-700/50 hover:bg-gray-900/70 cursor-pointer transition-all">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-blue-300 font-headline">
                                    <ShoppingCart />
                                    Plataforma de Cotações.
                                </CardTitle>
                                <CardDescription>Submeta itens, receba análises e negocie com fornecedores.</CardDescription>
                            </CardHeader>
                        </Card>
                    </DialogTrigger>
                    <DialogContent className="bg-black/80 backdrop-blur-md border-emerald-500/50 text-white max-w-5xl max-h-[90vh] flex flex-col">
                        <DialogHeader>
                            <DialogTitle className="text-emerald-300 font-headline flex items-center gap-2"><ShoppingCart />Plataforma de Intermediação de Cotações.</DialogTitle>
                            <DialogDescription>O sistema analisa o mercado e você negocia com os fornecedores em tempo real.</DialogDescription>
                        </DialogHeader>
                        <div className="text-sm text-gray-300 space-y-4 overflow-y-auto pr-4">
                        <Card className="bg-emerald-950/30 border-emerald-500/20">
                            <CardHeader>
                                <CardTitle className="font-headline text-base flex items-center gap-2 text-emerald-300">
                                    <FileSignature /> Registrar Item para Cotação.
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="item-name" className="text-xs">Nome Específico do Item</Label>
                                    <Input id="item-name" placeholder="Ex: Chapa de Aço SAE 1020" className="bg-black/30 border-emerald-800" value={quotationItemName} onChange={(e) => setQuotationItemName(e.target.value)} disabled={isQuotationLoading} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="item-spec" className="text-xs">Especificação (Peso/Litros)</Label>
                                    <Input id="item-spec" placeholder="Ex: 500kg" className="bg-black/30 border-emerald-800" value={quotationItemSpec} onChange={(e) => setQuotationItemSpec(e.target.value)} disabled={isQuotationLoading} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="item-delivery" className="text-xs">Prazo de Entrega Desejado</Label>
                                    <Input id="item-delivery" placeholder="Ex: 15 dias" className="bg-black/30 border-emerald-800" value={quotationDelivery} onChange={(e) => setQuotationDelivery(e.target.value)} disabled={isQuotationLoading} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="item-payment" className="text-xs">Condição de Pagamento</Label>
                                    <Input id="item-payment" placeholder="Ex: 30/60 dias" className="bg-black/30 border-emerald-800" value={quotationPayment} onChange={(e) => setQuotationPayment(e.target.value)} disabled={isQuotationLoading} />
                                </div>
                            </CardContent>
                            <CardFooter>
                                    <Button
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                                    onClick={handleQuotationSubmit}
                                    disabled={isQuotationLoading}
                                >
                                    {isQuotationLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analisando...</> : 'Submeter para Análise'}
                                </Button>
                            </CardFooter>
                        </Card>

                        {isQuotationLoading && (
                            <div className="flex justify-center items-center p-8">
                                <Loader2 className="h-8 w-8 animate-spin text-emerald-300" />
                                <p className="ml-4 text-emerald-300">A Inteligência Artificial está analisando o mercado...</p>
                            </div>
                        )}

                        {quotationError && (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Aviso</AlertTitle>
                                <AlertDescription>{quotationError}</AlertDescription>
                            </Alert>
                        )}

                        {quotationResult && (
                            <>
                                <Separator className="bg-emerald-800/50" />
                                <div className="space-y-3">
                                    <h3 className="font-headline text-lg text-emerald-300">Painel de Negociação Comparativo.</h3>
                                    <p className="text-xs text-gray-400">{quotationResult.analysis}</p>
                                    
                                    <Table className="border-separate border-spacing-y-2">
                                        <TableHeader>
                                            <TableRow className="border-b-0 hover:bg-black/10">
                                                <TableHead className="font-semibold text-gray-300 w-[20%]">Critério de Análise</TableHead>
                                                {quotationResult.suppliers.sort((a, b) => {
                                                    if (a.name === quotationResult.recommendedSupplierName) return -1;
                                                    if (b.name === quotationResult.recommendedSupplierName) return 1;
                                                    return 0;
                                                }).map(supplier => (
                                                    <TableHead key={supplier.name} className={cn("text-center font-semibold rounded-t-lg bg-black/40 p-2", supplier.name === quotationResult.recommendedSupplierName ? "text-blue-400 bg-blue-900/20" : "text-gray-200")}>
                                                        {supplier.name}
                                                        {supplier.name === quotationResult.recommendedSupplierName && <Trophy className="inline-block h-4 w-4 ml-1" />}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow className="border-0">
                                                <TableCell className="font-medium text-gray-300 align-top pt-3">1. Valor</TableCell>
                                                {quotationResult.suppliers.map(supplier => (
                                                    <TableCell key={supplier.name} className={cn("text-center text-lg font-mono font-bold bg-black/40", supplier.name === quotationResult.recommendedSupplierName && "bg-blue-900/20")}>
                                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(supplier.price)}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                            <TableRow className="border-0">
                                                <TableCell className="font-medium text-gray-300">2. Prazo</TableCell>
                                                {quotationResult.suppliers.map(supplier => (
                                                    <TableCell key={supplier.name} className={cn("text-center bg-black/40", supplier.name === quotationResult.recommendedSupplierName && "bg-amber-900/20")}>{supplier.deliveryDays} dias</TableCell>
                                                ))}
                                            </TableRow>
                                            <TableRow className="border-0">
                                                <TableCell className="font-medium text-gray-300">3. Pagamento</TableCell>
                                                {quotationResult.suppliers.map(supplier => (
                                                    <TableCell key={supplier.name} className={cn("text-center bg-black/40", supplier.name === quotationResult.recommendedSupplierName && "bg-amber-900/20")}>{supplier.paymentTerms}</TableCell>
                                                ))}
                                            </TableRow>
                                            <TableRow className="border-0">
                                                <TableCell className="font-medium text-gray-300">4. Confiabilidade</TableCell>
                                                {quotationResult.suppliers.map(supplier => (
                                                    <TableCell key={supplier.name} className={cn("text-center bg-black/40", supplier.name === quotationResult.recommendedSupplierName && "bg-amber-900/20")}>{supplier.reliability}%</TableCell>
                                                ))}
                                            </TableRow>
                                            <TableRow className="border-0">
                                                <TableCell className="font-medium text-gray-300 align-top pt-3">5. Especificação</TableCell>
                                                {quotationResult.suppliers.map(supplier => (
                                                    <TableCell key={`${supplier.name}-specs`} className={cn("text-left bg-black/40 text-[10px] align-top p-4", supplier.name === quotationResult.recommendedSupplierName && "bg-amber-900/10")}>
                                                        {supplier.itemBreakdown ? (
                                                            <div className="space-y-2">
                                                                {supplier.itemBreakdown.map((item, idx) => (
                                                                    <div key={idx} className="flex flex-col border-b border-gray-700/50 pb-1 mb-1 last:border-0 last:pb-0 last:mb-0">
                                                                        <span className="font-bold text-gray-200">{item.item} ({item.quantity})</span>
                                                                        <div className="flex justify-between text-gray-400">
                                                                            <span>Unit: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice)}</span>
                                                                            <span className="font-mono text-emerald-400">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.totalPrice)}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-500 italic">Detalhamento indisponível</span>
                                                        )}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                            <TableRow className="border-0">
                                                <TableCell className="font-medium text-gray-300 align-bottom pb-3">Contato</TableCell>
                                                {quotationResult.suppliers.map(supplier => {
                                                    const whatsappMessage = `Olá, ${supplier.consultantName}. Recebi sua cotação para ${quotationItemName} através da plataforma Nexus Intelligence e gostaria de discutir os detalhes.`;
                                                    const emailSubject = `Cotação: ${quotationItemName} - via Nexus Intelligence`;
                                                    const emailBody = `Prezado(a) ${supplier.consultantName},\n\nGostaríamos de dar seguimento à cotação para o item "${quotationItemName}" (${quotationItemSpec}).\n\nPor favor, confirme as condições abaixo ou nos informe sobre a possibilidade de negociação.\n\nAtenciosamente,`;
                                                    return (
                                                        <TableCell key={supplier.name} className={cn("text-center bg-black/40 rounded-b-lg", supplier.name === quotationResult.recommendedSupplierName && "bg-amber-900/20")}>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white w-full h-full">{supplier.consultantName}</Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent className="bg-black border-gray-600 text-white">
                                                                    <DropdownMenuLabel className="max-w-xs whitespace-normal">Resumo: {supplier.summary}</DropdownMenuLabel>
                                                                    <DropdownMenuSeparator className="bg-gray-600"/>
                                                                    <DropdownMenuItem asChild>
                                                                        <a href={`tel:${supplier.phone}`} className="cursor-pointer">
                                                                            <Phone className="mr-2 h-4 w-4"/> Chamada
                                                                        </a>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem asChild>
                                                                        <a href={`https://wa.me/${supplier.phone}?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                                                                            <MessageSquare className="mr-2 h-4 w-4"/> WhatsApp
                                                                        </a>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem asChild>
                                                                        <a href={`mailto:${supplier.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`} className="cursor-pointer">
                                                                            <Mail className="mr-2 h-4 w-4"/> E-mail
                                                                        </a>
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                                
                                <Separator className="bg-emerald-800/50" />

                                <Card className="bg-emerald-950/50 border-emerald-500/50">
                                    <CardHeader>
                                        <CardTitle className="font-headline text-base flex items-center gap-2 text-emerald-300">
                                            <Trophy /> Veredito do Sistema.
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <p><strong className="text-white">Recomendação:</strong> Fornecedor <strong className="text-emerald-300">{quotationResult.recommendedSupplierName}</strong>.</p>
                                        <p><strong className="text-white">Justificativa:</strong> {quotationResult.recommendationReason}</p>
                                    </CardContent>
                                </Card>

                                <Separator className="bg-emerald-800/50" />

                                <DanteComprasChat quotationAnalysis={quotationResult} isEmbedded={true} />

                                <Separator className="bg-emerald-800/50" />

                                <Card className="bg-black/40 border-zinc-800/50">
                                    <CardHeader>
                                        <CardTitle className="font-headline text-base flex items-center gap-2 text-primary">
                                            <FileSignature /> Registro de Decisão do Comprador.
                                        </CardTitle>
                                        <CardDescription className="text-gray-400">
                                            Após a análise da Inteligência Artificial, qual fornecedor foi escolhido para executar a ordem? Esta ação é imutável e será registrada para auditoria.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {!auditDecision ? (
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                                {quotationResult.suppliers.map(supplier => {
                                                    const isRecommended = supplier.name === quotationResult.recommendedSupplierName;
                                                    return (
                                                        <Button
                                                            key={supplier.name}
                                                            onClick={() => handleAuditDecision(supplier.name)}
                                                            className={cn(
                                                                "w-full justify-center gap-2 h-auto py-2 whitespace-normal",
                                                                    isRecommended ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-secondary-foreground"
                                                            )}
                                                            variant={isRecommended ? "default" : "secondary"}
                                                        >
                                                            {isRecommended && <Trophy className="h-4 w-4" />}
                                                            Executar com {supplier.name}
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className={cn("flex items-center gap-2 font-bold", auditDecision === quotationResult.recommendedSupplierName ? "text-emerald-300" : "text-rose-400")}>
                                                {auditDecision === quotationResult.recommendedSupplierName ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                                                <p>
                                                    {auditDecision === quotationResult.recommendedSupplierName 
                                                        ? `REGISTRO: Decisão alinhada com ${auditDecision}. Performance ótima registrada.` 
                                                        : `REGISTRO: Decisão de risco com ${auditDecision}. Desvio de performance será monitorado.`
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </>
                        )}
                        </div>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                         <Card className="bg-gray-900/50 border-blue-700/50 hover:bg-gray-900/70 cursor-pointer transition-all">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-blue-300 font-headline">
                                    <Layers />
                                    Relatórios de Economia.
                                </CardTitle>
                                <CardDescription>Análise de performance, economia acumulada e desvios.</CardDescription>
                            </CardHeader>
                        </Card>
                    </DialogTrigger>
                    <DialogContent className="bg-black/80 backdrop-blur-md border-emerald-500/50 text-white max-w-4xl max-h-[90vh] flex flex-col">
                        <DialogHeader>
                            <DialogTitle className="text-emerald-300 font-headline flex items-center gap-2"><Layers />Relatórios de Economia.</DialogTitle>
                        </DialogHeader>
                        <div className="text-sm text-gray-300 space-y-4 overflow-y-auto pr-4">
                            <Card className="bg-emerald-950/50 border-emerald-500/50 text-center">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-emerald-300">ECONOMIA GERAL ACUMULADA</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold text-white">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(computedEconomy)}
                                </p>
                            </CardContent>
                            </Card>

                            <Card className="bg-black/40 border-amber-500/30">
                                <CardHeader>
                                    <CardTitle className="font-headline text-base flex items-center gap-2 text-rose-400">
                                        <AlertTriangle />
                                        Análise de Desvio de Performance.
                                    </CardTitle>
                                    <CardDescription className="text-gray-400">
                                        Custo ou economia gerado por decisões que divergiram da recomendação do sistema.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                {lastDeviation ? (
                                    <div className="flex justify-between items-center p-3 rounded-md bg-rose-900/20 border border-rose-800/50">
                                        <div>
                                            <p className="text-xs text-gray-400">Último Desvio (Cotação: {lastDeviation.quotationId})</p>
                                            <p className="font-semibold text-white">Fornecedor {lastDeviation.chosen} escolhido em vez de {lastDeviation.recommended}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={cn(
                                                'text-lg font-bold',
                                                lastDeviation.costDifference > 0 ? 'text-red-400' : 'text-emerald-400'
                                            )}>
                                                {lastDeviation.costDifference > 0 ? '+' : ''} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lastDeviation.costDifference)}
                                            </p>
                                            <p className={cn(
                                                'text-xs',
                                                lastDeviation.costDifference > 0 ? 'text-red-500' : 'text-emerald-500'
                                            )}>
                                                {lastDeviation.costDifference > 0 ? 'Custo Adicional Gerado' : 'Economia não realizada'}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center p-3 rounded-md bg-gray-900/20 border border-gray-800/50">
                                        <p className="text-sm text-gray-500">Nenhum desvio de performance registrado na sessão atual.</p>
                                    </div>
                                )}
                                    <div className="text-center">
                                            <p className="text-sm text-gray-400">Custo Total de Desvios (Histórico)</p>
                                            <p className={cn(
                                                "text-2xl font-bold",
                                                totalDeviationCost > 0 ? "text-rose-400" : "text-emerald-400"
                                            )}>
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalDeviationCost)}
                                            </p>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <p className="text-xs text-gray-500 italic">Valores baseados no diferencial entre a escolha do comprador e a recomendação ótima do sistema no momento da decisão.</p>
                                </CardFooter>
                            </Card>

                            <Card className="bg-black/40 border-zinc-800/80">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div>
                                        <CardTitle className="font-headline text-base text-blue-300">
                                            Histórico de Auditoria Geral (Imutável)
                                        </CardTitle>
                                        <CardDescription className="text-gray-400">
                                            Registro permanente de decisões e isenções de responsabilidade comercial.
                                        </CardDescription>
                                    </div>
                                    {auditLogs.length > 0 && (
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => {
                                                if (confirm("Deseja realmente limpar os registros locais de auditoria?")) {
                                                    setAuditLogs([]);
                                                    localStorage.removeItem('nexus_compras_audit_log');
                                                    setLastDeviation(null);
                                                }
                                            }}
                                            className="bg-rose-950/40 text-rose-400 hover:bg-rose-900/40 text-xs border border-rose-800/50"
                                        >
                                            Limpar Registros (Teste)
                                        </Button>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    {auditLogs.length === 0 ? (
                                        <p className="text-gray-500 italic text-center py-6">Nenhuma decisão registrada até o momento.</p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="border-b border-zinc-800 hover:bg-black/10">
                                                        <TableHead className="text-gray-300 text-xs">Data/Hora</TableHead>
                                                        <TableHead className="text-gray-300 text-xs">Item</TableHead>
                                                        <TableHead className="text-gray-300 text-xs text-center">Escolha vs Rec.</TableHead>
                                                        <TableHead className="text-gray-300 text-xs text-right">Diferença</TableHead>
                                                        <TableHead className="text-gray-300 text-xs text-center">Status</TableHead>
                                                        <TableHead className="text-gray-300 text-xs text-right font-mono">Assinatura Log</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {auditLogs.map((log) => (
                                                        <TableRow key={log.id} className="hover:bg-white/5 border-b border-zinc-800/50">
                                                            <TableCell className="text-gray-400 text-[11px] font-mono">{log.timestamp}</TableCell>
                                                            <TableCell className="text-white font-medium text-[11px]">
                                                                {log.quotationName}
                                                                <span className="block text-[10px] text-gray-500 font-normal">{log.itemSpec}</span>
                                                            </TableCell>
                                                            <TableCell className="text-center text-[11px] text-gray-300">
                                                                <span className={cn(log.status === 'ALINHADO' ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold")}>
                                                                    {log.chosenSupplier}
                                                                </span>
                                                                <span className="text-gray-500"> vs {log.recommendedSupplier}</span>
                                                            </TableCell>
                                                            <TableCell className={cn("text-right text-[11px] font-semibold font-mono", log.costDifference > 0 ? "text-rose-400" : log.costDifference < 0 ? "text-emerald-400" : "text-gray-400")}>
                                                                {log.costDifference > 0 ? '+' : ''}
                                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(log.costDifference)}
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                <span className={cn(
                                                                    "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider",
                                                                    log.status === 'ALINHADO' 
                                                                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40" 
                                                                        : "bg-rose-950/60 text-rose-400 border border-rose-800/40"
                                                                )}>
                                                                    {log.status}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="text-right text-[9px] font-mono text-zinc-500 select-all">
                                                                {log.hash}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                    
                                    <div className="mt-4 p-3 rounded-md bg-amber-950/20 border border-amber-900/40">
                                        <p className="text-xs text-amber-300 font-semibold flex items-center gap-1.5">
                                            <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                                            Aviso de Isenção de Responsabilidade
                                        </p>
                                        <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                                            Cada entrada do histórico possui uma assinatura de hash criptográfica simulada para integridade. Ações marcadas como 
                                            <strong className="text-rose-400"> DIVERGENTE </strong> isentam formalmente o aplicativo e o motor de recomendação (Compras) de quaisquer passivos financeiros, perdas operacionais, ou danos causados pela aquisição de fornecedores com preços desfavoráveis ou menor índice de confiabilidade.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <Card className="bg-black/30 border-gray-700">
                                <CardHeader>
                                <CardTitle className="text-sm font-medium">Economia Diária (Últimos 7 dias).</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isMounted ? (
                                        <ChartContainer config={chartConfig} className="h-[200px] w-full">
                                            <BarChart data={dailyEconomy} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                            <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.5)' }} tickLine={{ stroke: 'rgba(255,255,255,0.2)' }} />
                                            <YAxis tick={{ fill: 'rgba(255,255,255,0.5)' }} tickLine={{ stroke: 'rgba(255,255,255,0.2)' }} />
                                            <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'rgba(255,255,255,0.1)' }} />
                                            <Bar dataKey="economy" fill="var(--color-economy)" radius={4} />
                                            </BarChart>
                                        </ChartContainer>
                                    ) : (
                                        <div className="h-[200px] w-full bg-slate-800/20 animate-pulse rounded-lg" />
                                    )}
                                </CardContent>
                            </Card>
                            <Card className="bg-black/30 border-gray-700">
                                <CardHeader>
                                <CardTitle className="text-sm font-medium">Acumulado Semanal (Últimas 4 semanas).</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isMounted ? (
                                        <ChartContainer config={chartConfig} className="h-[200px] w-full">
                                            <LineChart data={weeklyAccumulated} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                            <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.5)' }} tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}/>
                                            <YAxis tick={{ fill: 'rgba(255,255,255,0.5)' }} tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}/>
                                            <Tooltip content={<ChartTooltipContent />} cursor={{ stroke: 'rgba(255,255,255,0.2)' }}/>
                                            <Line type="monotone" dataKey="accumulated" stroke="var(--color-accumulated)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-accumulated)" }} />
                                            </LineChart>
                                        </ChartContainer>
                                    ) : (
                                        <div className="h-[200px] w-full bg-slate-800/20 animate-pulse rounded-lg" />
                                    )}
                                </CardContent>
                            </Card>
                            </div>
                            <Card className="bg-black/30 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Acumulado Mensal (Últimos 6 meses).</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                <LineChart data={monthlyAccumulated} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.5)' }} tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}/>
                                    <YAxis tick={{ fill: 'rgba(255,255,255,0.5)' }} tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}/>
                                    <Tooltip content={<ChartTooltipContent />} cursor={{ stroke: 'rgba(255,255,255,0.2)' }}/>
                                    <Line type="monotone" dataKey="accumulated" stroke="var(--color-accumulated)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-accumulated)" }} />
                                </LineChart>
                                </ChartContainer>
                            </CardContent>
                            </Card>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
          <LegalSafeguard module="COMPRAS" protocol="NX-7742-BUY" />
            </div>
        </SovereignShowcase>
    );
}
