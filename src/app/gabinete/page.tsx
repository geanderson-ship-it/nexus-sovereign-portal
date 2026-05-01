
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
  Gem,
  Radar,
  Award,
  Heart,
  ShoppingCart,
  Settings,
  FileSignature,
  DollarSign,
  ShieldCheck,
  BrainCircuit,
  Video,
  Trophy,
  AlertTriangle,
  Shirt,
  BookOpen,
  FileText,
  Clock,
  Link as LinkIcon,
  Terminal,
  Lock,
  CloudUpload,
  RotateCw,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Phone,
  Mail,
  MessageSquare,
  Sparkles,
  FileX,
  FileSearch,
  ClipboardList,
  LayoutGrid,
  Paintbrush,
  Projector,
  Palette,
  Library,
  ScanLine,
  PersonStanding,
  Scissors,
  Lightbulb,
  Volume2,
  Mic,
  Maximize,
  Minimize,
  Wheat,
  Sprout,
  TestTube,
  ThermometerSun,
  Beef,
  HeartPulse,
  Repeat,
  PiggyBank,
  Recycle,
  Upload,
  Sun,
  Wind,
  Droplets,
  Pause,
  Cpu,
  Github,
  LayoutDashboard,
  Code2,
  GitBranch,
  ChevronDown as ChevronDownIcon,
  Plus,
  Search
} from 'lucide-react';
import Link from 'next/link';
import {
  GabineteGithubHeader,
  GabineteFileList,
  GabineteReadme,
  GabineteGithubSidebar
} from '@/components/gabinete/github-style-gabinete';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import Image from 'next/image';
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
import { useNexusAudio } from '@/hooks/use-nexus-audio';
import placeholderImages from '@/lib/placeholder-images.json';
import { errorEmitter } from '@/firebase/error-emitter';
import { useSearchParams } from 'next/navigation';
import { useLocale } from '@/hooks/use-locale';
import { DjenyDesignModule } from '@/components/gabinete/djeny-design-module';
import { AnalyticsDashboard } from '@/components/gabinete/analytics-dashboard';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';


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
  { week: 'S-3', accumulated: 1200 },
  { week: 'S-2', accumulated: 2500 },
  { week: 'S-1', accumulated: 3800 },
  { week: 'Atual', accumulated: 5100 },
];
const monthlyAccumulated = [
  { month: 'M-5', accumulated: 5000 },
  { month: 'M-4', accumulated: 12000 },
  { month: 'M-3', accumulated: 19000 },
  { month: 'M-2', accumulated: 28000 },
  { month: 'M-1', accumulated: 35000 },
  { month: 'Atual', accumulated: 42000 },
];
const totalAccumulated = 152340.50;

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


export default function GabinetePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const [danteAuditorMenuOpen, setDanteAuditorMenuOpen] = React.useState(false);
  const [dantePcpMenuOpen, setDantePcpMenuOpen] = React.useState(false);
  const [djenyModaMenuOpen, setDjenyModaMenuOpen] = React.useState(false);
  const [djenyRhMenuOpen, setDjenyRhMenuOpen] = React.useState(false);
  const [djenyComercialMenuOpen, setDjenyComercialMenuOpen] = React.useState(false);
  const [danteSafraRegistered, setDanteSafraRegistered] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'app' | 'git'>('app');

  React.useEffect(() => {
    async function checkDanteSafraStatus() {
        if (user && firestore) {
            const userDocRef = doc(firestore, 'users', user.uid);
            try {
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists() && docSnap.data().danteSafraSetup?.isComplete) {
                    setDanteSafraRegistered(true);
                }
            } catch (e) {
                console.error("Failed to check Dante Safra setup status:", e);
            }
        }
    }
    checkDanteSafraStatus();
  }, [user, firestore]);

  

  return (
    <div className="min-h-screen bg-[#080b10] text-[#f0f6fc] font-sans selection:bg-blue-500/30">
      {/* View Toggle Bar */}
      <div className="bg-zinc-900/50 border-b border-zinc-800 px-4 py-2 flex justify-end gap-2 fixed top-0 left-0 right-0 z-[100] backdrop-blur-sm">
         <Button 
           size="sm" 
           variant={viewMode === 'app' ? 'default' : 'outline'}
           onClick={() => setViewMode('app')}
           className={cn(
             "h-7 text-[10px] uppercase font-black tracking-widest gap-2 transition-all",
             viewMode === 'app' ? "bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]" : "border-zinc-700 text-zinc-500 hover:text-white"
           )}
         >
           <LayoutDashboard className="h-3 w-3" /> Dashboard Elite
         </Button>
         <Button 
           size="sm" 
           variant={viewMode === 'git' ? 'default' : 'outline'}
           onClick={() => setViewMode('git')}
           className={cn(
             "h-7 text-[10px] uppercase font-black tracking-widest gap-2 transition-all",
             viewMode === 'git' ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "border-zinc-700 text-zinc-500 hover:text-white"
           )}
         >
           <Code2 className="h-3 w-3" /> Repository View
         </Button>
      </div>

      <div className="pt-11">
        {viewMode === 'app' ? (
          <div className="p-8 max-w-[1600px] mx-auto space-y-8">
       <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tighter text-white font-headline">
          Gabinete de Comando.
        </h1>
        <div className="relative aspect-video w-full max-w-4xl mx-auto rounded-lg overflow-hidden border-2 border-primary/20 shadow-xl shadow-primary/10 bg-black/30">
            <Image
                src="https://i.postimg.cc/Kj1cPYH3/Combine-the-first-im.png"
                alt="Nexus Holding Group Shield"
                fill
                sizes="100vw"
                style={{objectFit: 'contain'}}
                priority
            />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-white/80 font-headline">
            Nexus Holding Group
        </h2>
       </div>

      <AnalyticsDashboard />

      <div className="space-y-10 mb-16 px-4">
        <h2 className="text-3xl font-black font-headline text-white tracking-[0.5em] text-center uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          COMANDO DE ELITE
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1600px] mx-auto">
          {/* Card 1: MAGA LIVE */}
          <Card className="group relative flex flex-col bg-zinc-950/40 border-2 border-blue-500/20 backdrop-blur-xl overflow-hidden hover:border-blue-500/60 transition-all duration-700 shadow-[0_0_40px_rgba(59,130,246,0.05)]">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative h-48 w-full">
              <Image
                src="/maga-avatar-premium.png"
                alt="Maga Live"
                fill
                className="object-contain transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
            <div className="p-4 relative z-10 text-center">
              <CardHeader className="p-0 space-y-1">
                <CardTitle className="font-headline text-xl text-blue-300 tracking-wider">MAGA LIVE</CardTitle>
                <CardDescription className="text-blue-100/60 font-mono text-[10px] uppercase tracking-widest">{t('gabinete.main.magaLive.status')}</CardDescription>
              </CardHeader>
              <div className="mt-4">
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] text-xs">
                  <Link href="/intelligence/maga-live">{t('gabinete.main.magaLive.cta')}</Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Card 2: NEXUS COMMAND (UNIFICADO) */}
          <Card className="group relative flex flex-col bg-zinc-950/40 border-2 border-primary/20 backdrop-blur-xl overflow-hidden hover:border-primary/60 transition-all duration-700 shadow-[0_0_40px_rgba(234,179,8,0.05)] order-first lg:order-none">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative h-48 w-full">
              <Image
                src="https://i.postimg.cc/MzfP6jhW/Magadot-e-Orion.png"
                alt="Nexus Command"
                fill
                className="object-contain transition-transform duration-1000 group-hover:scale-110"
              />
            </div>
            <div className="p-4 relative z-10 text-center">
              <CardHeader className="p-0 space-y-1">
                <CardTitle className="font-headline text-2xl text-primary tracking-widest">NEXUS COMMAND</CardTitle>
                <CardDescription className="text-primary/60 font-mono text-[10px] uppercase tracking-[0.3em]">{t('gabinete.main.nexusCommand.status')}</CardDescription>
              </CardHeader>
              <div className="mt-4">
                <Button asChild variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary hover:text-black font-black tracking-widest py-4 rounded-xl text-sm">
                   <Link href="/intelligence">{t('gabinete.main.nexusCommand.cta')}</Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Card 3: ORION LIVE */}
          <Card className="group relative flex flex-col bg-zinc-950/40 border-2 border-slate-500/20 backdrop-blur-xl overflow-hidden hover:border-slate-500/60 transition-all duration-700 shadow-[0_0_40px_rgba(255,255,255,0.03)]">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative h-48 w-full">
              <Image
                src="/orion-avatar-premium.png"
                alt="Orion Live"
                fill
                className="object-contain grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
              />
            </div>
            <div className="p-4 relative z-10 text-center">
              <CardHeader className="p-0 space-y-1">
                <CardTitle className="font-headline text-xl text-slate-300 tracking-wider">ORION LIVE</CardTitle>
                <CardDescription className="text-slate-400/60 font-mono text-[10px] uppercase tracking-widest">{t('gabinete.main.orionLive.status')}</CardDescription>
              </CardHeader>
              <div className="mt-4">
                <Button asChild className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold tracking-widest py-4 rounded-xl text-xs">
                  <Link href="/intelligence/orion-live">{t('gabinete.main.orionLive.cta')}</Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Card 4: NEXUS STUDIO */}
          <Card className="group relative flex flex-col bg-zinc-950/40 border-2 border-amber-500/20 backdrop-blur-xl overflow-hidden hover:border-amber-500/60 transition-all duration-700 shadow-[0_0_40px_rgba(245,158,11,0.05)]">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative h-48 w-full">
              <Image
                src="https://i.postimg.cc/t4nTCxJZ/Nexus-studio.png"
                alt="Nexus Studio"
                fill
                className="object-contain transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
            <div className="p-4 relative z-10 text-center">
              <CardHeader className="p-0 space-y-1">
                <CardTitle className="font-headline text-xl text-amber-400 tracking-wider">NEXUS STUDIO</CardTitle>
                <CardDescription className="text-amber-100/60 font-mono text-[10px] uppercase tracking-widest">{t('gabinete.main.nexusStudio.status')}</CardDescription>
              </CardHeader>
              <div className="mt-4">
                <Button asChild className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] text-xs">
                  <Link href="/gabinete/studio">{t('gabinete.main.nexusStudio.cta')}</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* Dante Modules */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tighter text-emerald-400 font-headline text-center [text-shadow:0_0_12px_theme(colors.emerald.500)]">{t('gabinete.main.danteModules')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          
            {/* Card 1: DANTE COMPRAS (O Negociador) */}
            <Card className="flex flex-col bg-zinc-950/60 border-2 border-emerald-500/20 backdrop-blur-md shadow-2xl transition-all duration-300 group h-full overflow-hidden hover:border-emerald-500/40">
                <div className="relative h-48 w-full">
                    <Image
                        src="https://i.postimg.cc/9XTHKFGj/Dante-compras.jpg"
                        alt="Dante Compras"
                        fill
                        className="object-contain"
                    />
                </div>
                <div className="p-6 flex-grow">
                    <CardHeader className="p-0">
                        <CardTitle className="font-headline text-xl text-emerald-300 flex items-center gap-3">
                            <ShoppingCart className="h-6 w-6"/> Dante Compras (O Negociador)
                        </CardTitle>
                        <CardDescription className="text-gray-300 !mt-2">
                            Análise de cotações, estratégia de negociação e inteligência de suprimentos.
                        </CardDescription>
                    </CardHeader>
                </div>
                <div className="p-6 pt-0 mt-auto">
                    <Button asChild className="w-full font-bold tracking-widest bg-emerald-600/80 hover:bg-emerald-600 text-white">
                        <Link href="/intelligence/compras">[ ACESSAR MÓDULO ]</Link>
                    </Button>
                </div>
            </Card>
            
            {/* Card 2: DANTE AUDITOR (O Sentinela) */}
            <Card className="flex flex-col bg-zinc-950/60 border-2 border-blue-500/20 backdrop-blur-md shadow-2xl transition-all duration-300 group h-full overflow-hidden hover:border-blue-500/40">
                <div className="relative h-48 w-full">
                    <Image
                        src="https://i.postimg.cc/CLTSxfw3/Dante%20Auditor.png"
                        alt="Dante Auditor"
                        fill
                        className="object-contain"
                    />
                </div>
                <Collapsible open={danteAuditorMenuOpen} onOpenChange={setDanteAuditorMenuOpen} className="w-full flex flex-col flex-grow">
                    <div className="p-6 flex-grow">
                        <CardHeader className="p-0">
                            <CardTitle className="font-headline text-xl text-blue-300 flex items-center gap-3">
                                <ShieldCheck className="h-6 w-6"/> {t('gabinete.main.danteAuditor.title')}
                            </CardTitle>
                            <CardDescription className="text-gray-300 !mt-2">
                              {t('gabinete.main.danteAuditor.description')}
                            </CardDescription>
                        </CardHeader>
                    </div>
                    <div className="p-6 pt-0 mt-auto">
                        <CollapsibleTrigger asChild>
                            <Button className="w-full font-bold tracking-widest bg-blue-600/80 hover:bg-blue-600 text-white">{t('gabinete.main.cta.access')}</Button>
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="CollapsibleContent mt-auto">
                        <div className="flex flex-col sm:flex-row gap-2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 p-6 pt-0">
                            <Dialog>
                                  <DialogTrigger asChild>
                                      <Button variant="outline" className="flex-1 justify-center text-center gap-2 text-base p-4 border-blue-500/30 text-blue-300/90 hover:bg-blue-500/10 hover:text-blue-300">
                                          <FileX className="h-5 w-5 text-blue-400" />
                                          <span>{t('gabinete.main.nonConformance')}</span>
                                      </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-black/80 backdrop-blur-md border-blue-500/50 text-white">
                                    <DialogHeader>
                                        <DialogTitle className="text-blue-300 font-headline flex items-center gap-2"><FileX />Relatórios de Não-Conformidade.</DialogTitle>
                                        <DialogDescription>Registros de desvios de qualidade e ações corretivas.</DialogDescription>
                                    </DialogHeader>
                                    <div className="text-center py-8">
                                        <p className="text-gray-400">Nenhum desvio crítico registrado nas últimas 24 horas.</p>
                                    </div>
                                  </DialogContent>
                              </Dialog>
                              <Dialog>
                                  <DialogTrigger asChild>
                                      <Button variant="outline" className="flex-1 justify-center text-center gap-2 text-base p-4 border-blue-500/30 text-blue-300/90 hover:bg-blue-500/10 hover:text-blue-300">
                                          <FileSearch className="h-5 w-5 text-blue-400" />
                                          <span>Inspeção</span>
                                      </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-black/80 backdrop-blur-md border-blue-500/50 text-white">
                                    <DialogHeader>
                                        <DialogTitle className="text-blue-300 font-headline flex items-center gap-2"><FileSearch />Inspeção de Processos.</DialogTitle>
                                        <DialogDescription>Auditoria de acabamento (Wamóvel/JMS) e vácuo (PSG).</DialogDescription>
                                    </DialogHeader>
                                    <div className="text-center py-8">
                                        <p className="text-gray-400">Todos os processos operando dentro da conformidade.</p>
                                    </div>
                                  </DialogContent>
                              </Dialog>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </Card>

            {/* Card 3: DANTE PCP (O Maestro) */}
            <Card className="flex flex-col bg-zinc-950/60 border-2 border-slate-500/20 backdrop-blur-md shadow-2xl transition-all duration-300 group h-full overflow-hidden hover:border-slate-500/40">
                <div className="relative h-48 w-full">
                    <Image
                        src="https://i.postimg.cc/X7S4Yynt/Dante-PPCP.png"
                        alt="Dante PCP"
                        fill
                        className="object-contain"
                    />
                </div>
                <Collapsible open={dantePcpMenuOpen} onOpenChange={setDantePcpMenuOpen} className="w-full flex flex-col flex-grow">
                    <div className="p-6 flex-grow">
                        <CardHeader className="p-0">
                            <CardTitle className="font-headline text-xl text-gray-300 flex items-center gap-3">
                                <ClipboardList className="h-6 w-6"/> Dante PCP (O Maestro)
                            </CardTitle>
                            <CardDescription className="text-gray-300 !mt-2">
                              Cronograma de máquinas, ordens de produção e eficiência de tempo.
                            </CardDescription>
                        </CardHeader>
                    </div>
                    <div className="p-6 pt-0 mt-auto">
                        <CollapsibleTrigger asChild>
                            <Button variant="outline" className="w-full font-bold tracking-widest border-gray-400 text-gray-300 hover:bg-gray-500/10 hover:text-white">[ ACESSAR MÓDULO ]</Button>
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="CollapsibleContent mt-auto">
                        <div className="flex flex-col sm:flex-row gap-2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 p-6 pt-0">
                            <Dialog>
                                  <DialogTrigger asChild>
                                      <Button variant="outline" className="flex-1 justify-center text-center gap-2 text-base p-4 border-gray-500/30 text-gray-300/90 hover:bg-gray-500/10 hover:text-gray-300">
                                          <LayoutGrid className="h-5 w-5 text-gray-400" />
                                          <span>Dashboard</span>
                                      </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-black/80 backdrop-blur-md border-gray-500/50 text-white">
                                    <DialogHeader>
                                        <DialogTitle className="text-gray-300 font-headline flex items-center gap-2"><LayoutGrid />Dashboard de Produção.</DialogTitle>
                                        <DialogDescription>Visão geral do chão de fábrica.</DialogDescription>
                                    </DialogHeader>
                                    <div className="text-center py-8">
                                        <p className="text-gray-400">Carregando dados do sequenciamento de produção...</p>
                                    </div>
                                  </DialogContent>
                              </Dialog>
                              <Dialog>
                                  <DialogTrigger asChild>
                                      <Button variant="outline" className="flex-1 justify-center text-center gap-2 text-base p-4 border-gray-500/30 text-gray-300/90 hover:bg-gray-500/10 hover:text-gray-300">
                                          <ClipboardList className="h-5 w-5 text-gray-400" />
                                          <span>Ordens de Produção</span>
                                      </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-black/80 backdrop-blur-md border-gray-500/50 text-white">
                                    <DialogHeader>
                                        <DialogTitle className="text-gray-300 font-headline flex items-center gap-2"><ClipboardList />Gerenciar Ordens.</DialogTitle>
                                        <DialogDescription>Fila de ordens e alocação de recursos.</DialogDescription>
                                    </DialogHeader>
                                    <div className="text-center py-8">
                                        <p className="text-gray-400">Nenhuma ordem pendente de alocação.</p>
                                    </div>
                                  </DialogContent>
                              </Dialog>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </Card>

             {/* Card 4: Dante Builder */}
            <Card className="flex flex-col bg-zinc-950/60 border-2 border-cyan-500/20 backdrop-blur-md shadow-2xl transition-all duration-300 group h-full overflow-hidden hover:border-cyan-500/40">
                <div className="relative h-48 w-full">
                    <Image
                        src="https://i.postimg.cc/MK2qpjzh/Dante-Builder.png"
                        alt="Dante Builder"
                        fill
                        className="object-contain"
                    />
                </div>
                <div className="p-6 flex-grow">
                    <CardHeader className="p-0">
                        <CardTitle className="font-headline text-xl text-cyan-300 flex items-center gap-3">
                            <Cpu className="h-6 w-6"/> {t('gabinete.main.danteBuilder.title')}
                        </CardTitle>
                        <CardDescription className="text-gray-300 !mt-2">
                            {t('gabinete.main.danteBuilder.description')}
                        </CardDescription>
                    </CardHeader>
                </div>
                <div className="p-6 pt-0 mt-auto">
                    <Button asChild className="w-full font-bold tracking-widest bg-cyan-600/80 hover:bg-cyan-600 text-white">
                        <Link href="/intelligence/dante-builder">{t('gabinete.main.cta.terminal')}</Link>
                    </Button>
                </div>
            </Card>
        </div>
      </div>

      {/* Djeny Modules */}
      <div className="space-y-6 mt-16">
         <h2 className="text-2xl font-bold tracking-tighter text-amber-400 font-headline text-center [text-shadow:0_0_12px_theme(colors.amber.500)]">{t('gabinete.main.djenyModules')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

             {/* Card 6: Djeny RH */}
            <Card className="flex flex-col bg-zinc-950/60 border-2 border-purple-500/20 backdrop-blur-md shadow-2xl transition-all duration-300 group h-full overflow-hidden hover:border-purple-500/40">
                 <div className="relative h-48 w-full">
                    <Image
                        src="https://i.postimg.cc/K88VGZgc/Djeny-analista-de-RH.png"
                        alt="Djeny RH"
                        fill
                        className="object-contain"
                    />
                </div>
                <Collapsible open={djenyRhMenuOpen} onOpenChange={setDjenyRhMenuOpen} className="w-full flex flex-col flex-grow">
                    <div className="p-6 flex-grow">
                        <CardHeader className="p-0">
                             <CardTitle className="font-headline text-xl text-purple-300 flex items-center gap-3">
                                 <Award className="h-6 w-6"/> {t('gabinete.main.djenyRh.title')}
                             </CardTitle>
                            <CardDescription className="text-gray-300 !mt-2">
                               {t('gabinete.main.djenyRh.description')}
                            </CardDescription>
                        </CardHeader>
                    </div>
                    <div className="p-6 pt-0 mt-auto">
                        <CollapsibleTrigger asChild>
                            <Button variant="outline" className="w-full font-bold tracking-widest border-purple-400 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200">{t('gabinete.main.cta.access')}</Button>
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="CollapsibleContent mt-auto">
                        <div className="space-y-2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 p-6 pt-0">
                            <Button asChild variant="outline" className="w-full justify-center gap-3 text-base p-6 border-purple-500/30 text-purple-300/90 hover:bg-purple-500/10 hover:text-purple-300 shadow-md shadow-purple-500/10 hover:shadow-purple-500/20 transition-shadow">
                                <Link href="/gabinete/recrutamento" className="flex items-center gap-3">
                                    <Video className="h-5 w-5 text-purple-400" />
                                    <span>Recrutamento (IA Humana)</span>
                                </Link>
                            </Button>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full justify-center gap-3 text-base p-6 border-purple-500/30 text-purple-300/90 hover:bg-purple-500/10 hover:text-purple-300 shadow-md shadow-purple-500/10 hover:shadow-purple-500/20 transition-shadow">
                                        <Award className="h-5 w-5 text-purple-400" />
                                        <span>RH & Comportamento</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-black/80 backdrop-blur-md border-purple-500/50 text-white max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-purple-300 font-headline flex items-center gap-2"><Award />Engenharia de Mérito.</DialogTitle>
                                        <DialogDescription className="text-gray-400">Sistema de ranking e desenvolvimento de talentos com base em performance.</DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4 grid grid-cols-1 gap-4">
                                      <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start gap-3 text-base p-6 border-blue-400/30 text-blue-300/90 hover:bg-blue-400/10 hover:text-blue-300">
                                                <Radar className="h-5 w-5 text-blue-400" />
                                                <span>Módulo Operacional (Filtro Zero)</span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-black/80 backdrop-blur-md border-blue-400/50 text-white max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle className="text-blue-300 font-headline flex items-center gap-2"><Radar />Módulo Operacional.</DialogTitle>
                                                <DialogDescription className="text-gray-400">Análise de dados brutos de assiduidade e conformidade.</DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                      </Dialog>
                                      <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start gap-3 text-base p-6 border-purple-400/30 text-purple-300/90 hover:bg-purple-400/10 hover:text-purple-300">
                                                <BrainCircuit className="h-5 w-5 text-purple-400" />
                                                <span>{t('gabinete.main.dialog.recruitment')}</span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-black/80 backdrop-blur-md border-purple-400/50 text-white max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle className="text-purple-300 font-headline flex items-center gap-2"><BrainCircuit />Módulo Liderança.</DialogTitle>
                                                <DialogDescription className="text-gray-400">Análise de desempenho, relacionamento e proatividade.</DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                      </Dialog>
                                      <Dialog>
                                          <DialogTrigger asChild>
                                              <Button variant="outline" className="w-full justify-start gap-3 text-base p-6 border-emerald-500/30 text-emerald-300/90 hover:bg-emerald-500/10 hover:text-emerald-300">
                                                  <FileSignature className="h-5 w-5 text-emerald-400" />
                                                  <span>Módulo Supervisão (Veredito do Setor)</span>
                                              </Button>
                                          </DialogTrigger>
                                          <DialogContent className="bg-black/80 backdrop-blur-md border-emerald-500/50 text-white max-w-2xl">
                                              <DialogHeader>
                                                  <DialogTitle className="text-emerald-300 font-headline flex items-center gap-2"><FileSignature />Módulo Supervisão.</DialogTitle>
                                                  <DialogDescription className="text-gray-400">Análise da performance sob a ótica do líder direto.</DialogDescription>
                                              </DialogHeader>
                                          </DialogContent>
                                      </Dialog>
                                      <Dialog>
                                          <DialogTrigger asChild>
                                              <Button variant="outline" className="w-full justify-start gap-3 text-base p-6 border-amber-400/30 text-amber-300/90 hover:bg-amber-400/10 hover:text-amber-300">
                                                  <Trophy className="h-5 w-5 text-amber-400" />
                                                  <span>Status de Classificação (O Ranking)</span>
                                              </Button>
                                          </DialogTrigger>
                                          <DialogContent className="bg-black/80 backdrop-blur-md border-amber-400/50 text-white max-w-2xl">
                                              <DialogHeader>
                                                  <DialogTitle className="text-amber-300 font-headline flex items-center gap-2"><Trophy />Status de Classificação.</DialogTitle>
                                                  <DialogDescription className="text-gray-400">Painel de score, categorias e ciclo de avaliação.</DialogDescription>
                                              </DialogHeader>
                                          </DialogContent>
                                      </Dialog>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </Card>
                        {/* Card 7: Djeny Comercial */}
            <Card className="flex flex-col bg-zinc-950/60 border-2 border-amber-500/20 backdrop-blur-md shadow-2xl transition-all duration-300 group h-full overflow-hidden hover:border-amber-500/40">
                <div className="relative h-48 w-full">
                    <Image
                        src="https://i.postimg.cc/zGGMzJRX/Djeny%20estrategista%20comercial.png"
                        alt="Djeny Comercial"
                        fill
                        className="object-contain"
                    />
                </div>
                <Collapsible open={djenyComercialMenuOpen} onOpenChange={setDjenyComercialMenuOpen} className="w-full flex flex-col flex-grow">
                    <div className="p-6 flex-grow">
                        <CardHeader className="p-0">
                             <CardTitle className="font-headline text-xl text-amber-300 flex items-center gap-3">
                                 <Lightbulb className="h-6 w-6"/> {t('gabinete.main.djenyComercial.title')}
                             </CardTitle>
                            <CardDescription className="text-gray-300 !mt-2">
                               {t('gabinete.main.djenyComercial.description')}
                            </CardDescription>
                        </CardHeader>
                    </div>
                    <div className="p-6 pt-0 mt-auto">
                        <CollapsibleTrigger asChild>
                            <Button variant="outline" className="w-full font-bold tracking-widest border-amber-400 text-amber-300 hover:bg-amber-500/10 hover:text-amber-200">[ ACESSAR MÓDULO ]</Button>
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="CollapsibleContent mt-auto">
                        <div className="space-y-2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 p-6 pt-0">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full justify-center gap-3 text-base p-6 border-amber-500/30 text-amber-300/90 hover:bg-amber-500/10 hover:text-amber-300 shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 transition-shadow">
                                        <Lightbulb className="h-5 w-5 text-amber-400" />
                                        <span>Comercial & Estratégia</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-black/80 backdrop-blur-md border-amber-500/50 text-white max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-amber-300 font-headline flex items-center gap-2"><Lightbulb />Comercial & Estratégia.</DialogTitle>
                                        <DialogDescription className="text-gray-400">Inteligência de mercado, análise competitiva e posicionamento de marca.</DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4 text-center">
                                        <p className="text-gray-400">Painel de inteligência de mercado em desenvolvimento.</p>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </Card>


             {/* Card Djeny Modas */}
            <Card className="flex flex-col bg-zinc-950/60 border-2 border-rose-500/20 backdrop-blur-md shadow-2xl transition-all duration-300 group h-full overflow-hidden hover:border-rose-500/40">
                <div className="relative h-48 w-full">
                    <Image
                        src="https://i.postimg.cc/nhh5FHQh/Djeny-modas.png"
                        alt="Djeny Modas"
                        fill
                        className="object-contain"
                    />
                </div>
                <Collapsible open={djenyModaMenuOpen} onOpenChange={setDjenyModaMenuOpen} className="w-full flex flex-col flex-grow">
                    <div className="p-6 flex-grow">
                        <CardHeader className="p-0">
                            <CardTitle className="font-headline text-xl text-rose-300 flex items-center gap-3">
                                <Shirt className="h-6 w-6"/> {t('gabinete.main.djenyModas.title')}
                            </CardTitle>
                            <CardDescription className="text-gray-300 !mt-2">
                               {t('gabinete.main.djenyModas.description')}
                            </CardDescription>
                        </CardHeader>
                    </div>
                    <div className="p-6 pt-0 mt-auto">
                        <CollapsibleTrigger asChild>
                            <Button variant="outline" className="w-full font-bold tracking-widest border-rose-400 text-rose-300 hover:bg-rose-500/10 hover:text-rose-200">[ ACESSAR MÓDULO ]</Button>
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="CollapsibleContent mt-auto">
                        <div className="space-y-2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 p-6 pt-0">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start gap-3 text-base p-4 border-rose-400/30 text-rose-300/90 hover:bg-rose-400/10 hover:text-rose-300">
                                        <PersonStanding className="h-5 w-5 text-rose-400" />
                                        <span>{t('gabinete.main.dialog.digitalFitting')}</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-black/80 backdrop-blur-md border-rose-400/50 text-white max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-rose-300 font-headline flex items-center gap-2"><PersonStanding />Provador Digital.</DialogTitle>
                                        <DialogDescription className="text-gray-400">Escaneamento de biotipo e simulação de vestibilidade 3D para um ajuste perfeito.</DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                              </Dialog>
                              <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start gap-3 text-base p-4 border-rose-400/30 text-rose-300/90 hover:bg-rose-400/10 hover:text-rose-300">
                                        <Layers className="h-5 w-5 text-rose-400" />
                                        <span>{t('gabinete.main.dialog.fiberManagement')}</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-black/80 backdrop-blur-md border-rose-400/50 text-white max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-rose-300 font-headline flex items-center gap-2"><Layers />Gestão de Fibras.</DialogTitle>
                                        <DialogDescription className="text-gray-400">Banco de dados inteligente de tecidos, com informações sobre caimento, textura e uso.</DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                              </Dialog>
                              <Dialog>
                                  <DialogTrigger asChild>
                                      <Button variant="outline" className="w-full justify-start gap-3 text-base p-4 border-rose-400/30 text-rose-300/90 hover:bg-rose-400/10 hover:text-rose-300">
                                          <Scissors className="h-5 w-5 text-rose-400" />
                                          <span>{t('gabinete.main.dialog.spreadCosts')}</span>
                                      </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-black/80 backdrop-blur-md border-rose-400/50 text-white max-w-2xl">
                                      <DialogHeader>
                                          <DialogTitle className="text-rose-300 font-headline flex items-center gap-2"><Scissors />Custos de Enfesto.</DialogTitle>
                                          <DialogDescription className="text-gray-400">Otimização de corte e cálculo de desperdício para uma produção mais lucrativa e sustentável.</DialogDescription>
                                      </DialogHeader>
                                  </DialogContent>
                              </Dialog>
                              <Dialog>
                                  <DialogTrigger asChild>
                                      <Button variant="outline" className="w-full justify-start gap-3 text-base p-4 border-rose-400/30 text-rose-300/90 hover:bg-rose-400/10 hover:text-rose-300">
                                          <BookOpen className="h-5 w-5 text-rose-400" />
                                          <span>{t('gabinete.main.dialog.marketingCatalog')}</span>
                                      </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-black/80 backdrop-blur-md border-rose-400/50 text-white max-w-2xl">
                                      <DialogHeader>
                                          <DialogTitle className="text-rose-300 font-headline flex items-center gap-2"><BookOpen />Catálogo Autoral.</DialogTitle>
                                          <DialogDescription className="text-gray-400">Renderização da coleção com foco em conversão e apelo visual para o mercado de luxo.</DialogDescription>
                                      </DialogHeader>
                                  </DialogContent>
                              </Dialog>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </Card>

        </div>
      </div>
        </div>
      ) : (
        <div className="bg-[#0d1117] min-h-screen">
          <GabineteGithubHeader />
          <main className="container mx-auto py-8 px-4 md:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex rounded-md overflow-hidden border border-zinc-700 shadow-sm">
                      <Button variant="ghost" size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 gap-2 border-r border-zinc-700 h-8 text-xs px-3">
                        <GitBranch className="h-4 w-4 text-zinc-500" /> main
                      </Button>
                      <Button variant="ghost" size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 h-8 text-xs px-2">
                        <ChevronDownIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                      <input 
                        type="text" 
                        placeholder="Go to file" 
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-md py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-500 text-white gap-2 h-8 text-xs px-3 font-bold">
                      <Plus className="h-4 w-4" /> New Module
                    </Button>
                  </div>
                </div>
                <GabineteFileList />
                <GabineteReadme />
              </div>
              <div className="w-full lg:w-72 space-y-8">
                <GabineteGithubSidebar />
              </div>
            </div>
          </main>
          <footer className="border-t border-zinc-800 py-10 mt-20">
            <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
              <div className="flex items-center gap-4">
                 <Image src="/logo-nexus-shield.png" alt="Nexus Shield" width={24} height={24} className="opacity-50 grayscale" />
                 <span>© 2026 Nexus Intelligence Group.</span>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
    </div>
  );
}







    




















    





    
