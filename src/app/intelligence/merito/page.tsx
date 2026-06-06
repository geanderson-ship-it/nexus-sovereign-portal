'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  FileText, 
  Loader2, 
  PlusCircle, 
  ServerCrash,
  Users, 
  Search, 
  Filter, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Camera,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/auth';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { permanentEmployees } from '@/lib/data/employees';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';

interface MeritIndex {
    id: string;
    employeeName: string;
    evaluationDate: string;
    finalMeritIndex: number;
}

export default function MeritoPage() {
    const { user, isUserLoading } = useUser();
    const [searchTerm, setSearchTerm] = useState('');

    const [employees, setEmployees] = useState(permanentEmployees);
    const [evaluations, setEvaluations] = useState<MeritIndex[]>([]);
    const areEvaluationsLoading = false;
    const error = null;
    const [isCadastroModalOpen, setIsCadastroModalOpen] = useState(false);
    const [newEmpData, setNewEmpData] = useState({
        name: '',
        role: '',
        department: 'Produção',
        meritScore: 8.0,
        status: 'active' as const,
        admissionDate: new Date().toISOString().split('T')[0]
    });

    const isLoading = isUserLoading || areEvaluationsLoading;

    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            // 1. Carregar colaboradores da base persistida ou usar o default
            let currentEmployees = [...permanentEmployees];
            const storedEmps = localStorage.getItem('nexus_permanent_employees');
            if (storedEmps) {
                currentEmployees = JSON.parse(storedEmps);
            } else {
                localStorage.setItem('nexus_permanent_employees', JSON.stringify(permanentEmployees));
            }

            // 2. Carregar avaliações
            const stored = localStorage.getItem('nexus_merit_evaluations');
            if (stored) {
                const list = JSON.parse(stored);
                
                // Mapear para o formato MeritIndex
                const meritIndices: MeritIndex[] = list.map((item: any) => ({
                    id: item.id,
                    employeeName: item.employeeName,
                    evaluationDate: item.date,
                    finalMeritIndex: item.finalScore
                }));
                // Ordenar por data decrescente
                meritIndices.sort((a: any, b: any) => new Date(b.evaluationDate).getTime() - new Date(a.evaluationDate).getTime());
                setEvaluations(meritIndices);

                // Calcular notas atualizadas baseadas nas avaliações do histórico
                currentEmployees = currentEmployees.map(emp => {
                    const empEvals = list.filter((evalRecord: any) => evalRecord.employeeId === emp.id);
                    if (empEvals.length > 0) {
                        const sumOfNewEvals = empEvals.reduce((acc: number, curr: any) => acc + curr.finalScore, 0);
                        const totalScore = emp.meritScore + sumOfNewEvals;
                        const averageScore = totalScore / (1 + empEvals.length);
                        return {
                            ...emp,
                            meritScore: averageScore
                        };
                    }
                    return emp;
                });
            }
            setEmployees(currentEmployees);
        } catch (e) {
            console.error("Erro ao carregar dados do localStorage:", e);
        }
    }, []);

    const handleAddEmployee = () => {
        if (!newEmpData.name.trim() || !newEmpData.role.trim()) {
            alert("Por favor, preencha o nome e o cargo.");
            return;
        }

        const newId = 'emp-' + Math.random().toString(36).substring(2, 9);
        const newEmployee = {
            id: newId,
            name: newEmpData.name,
            role: newEmpData.role,
            department: newEmpData.department,
            admissionDate: newEmpData.admissionDate || new Date().toISOString().split('T')[0],
            meritScore: Number(newEmpData.meritScore) || 8.0,
            status: newEmpData.status,
            avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
        };

        try {
            const storedEmps = localStorage.getItem('nexus_permanent_employees');
            const list = storedEmps ? JSON.parse(storedEmps) : [...permanentEmployees];
            list.push(newEmployee);
            localStorage.setItem('nexus_permanent_employees', JSON.stringify(list));
            
            // Recarregar os dados para re-calcular médias
            setEmployees(list);
            
            const stored = localStorage.getItem('nexus_merit_evaluations');
            let updatedList = [...list];
            if (stored) {
                const evalList = JSON.parse(stored);
                updatedList = list.map((emp: any) => {
                    const empEvals = evalList.filter((evalRecord: any) => evalRecord.employeeId === emp.id);
                    if (empEvals.length > 0) {
                        const sumOfNewEvals = empEvals.reduce((acc: number, curr: any) => acc + curr.finalScore, 0);
                        const totalScore = emp.meritScore + sumOfNewEvals;
                        const averageScore = totalScore / (1 + empEvals.length);
                        return {
                            ...emp,
                            meritScore: averageScore
                        };
                    }
                    return emp;
                });
            }
            setEmployees(updatedList);

            setIsCadastroModalOpen(false);
            setNewEmpData({
                name: '',
                role: '',
                department: 'Produção',
                meritScore: 8.0,
                status: 'active',
                admissionDate: new Date().toISOString().split('T')[0]
            });
        } catch (e) {
            console.error("Erro ao cadastrar colaborador:", e);
        }
    };

    const filteredEmployees = employees.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <SovereignShowcase moduleName="Engenharia de Mérito" imagePath="/Nexus Intelligence RH/Nexus Intelligence RH.png">
            <div className="min-h-screen bg-[#020617] text-slate-200 p-8 space-y-8">
            {/* HERO SECTION - NOVO */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-[48px] bg-gradient-to-br from-slate-900 via-slate-900/50 to-[#020617] border border-white/5 shadow-2xl"
            >
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[50%] h-full bg-primary/5 blur-[120px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-[30%] h-full bg-blue-900/10 blur-[100px] rounded-full" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 p-8 lg:p-16">
                    <div className="flex-1 space-y-8 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-center lg:justify-start gap-3">
                                <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1 text-[10px] font-black uppercase tracking-widest italic">
                                    Strategic HR Systems
                                </Badge>
                                <div className="h-[1px] w-12 bg-primary/30" />
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-white font-headline uppercase leading-none">
                                RH & Pessoas <br />
                                <span className="text-primary italic">Engenharia de Mérito</span>
                            </h1>
                            <p className="text-lg lg:text-xl text-slate-400 max-w-2xl font-medium leading-relaxed">
                                Gestão de performance e auditoria de Índice de Mérito Nexus (IMN). 
                                Implemente uma cultura de meritocracia técnica e auditável em tempo real.
                            </p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-wrap items-center justify-center lg:justify-start gap-6"
                        >
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-3xl backdrop-blur-md">
                                <Award className="h-8 w-8 text-primary" />
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocolo de Auditoria</p>
                                    <p className="text-sm font-bold text-white uppercase tracking-tighter">IMN-CORE-v2.5</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-3xl backdrop-blur-md">
                                <ShieldCheck className="h-8 w-8 text-emerald-500" />
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status do Sistema</p>
                                    <p className="text-sm font-bold text-emerald-400 uppercase tracking-tighter">Operacional</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative w-full lg:w-[450px] aspect-square group"
                    >
                        <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full group-hover:bg-primary/30 transition-all duration-700" />
                        <div className="relative h-full w-full rounded-[40px] overflow-hidden border border-white/10 bg-slate-900 shadow-2xl">
                            <Image 
                                src="https://i.postimg.cc/vmfBDtwB/Nexus-RH-Jon.png"
                                alt="Engenharia de Mérito"
                                fill
                                className="object-cover transition-transform duration-[3s] group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="flex items-center justify-between p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Digital Twin RH</span>
                                    <Badge className="bg-emerald-500 text-black border-none font-black text-[9px]">ACTIVE</Badge>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-4 right-12 opacity-10">
                    <span className="text-[120px] font-black text-white italic select-none">NEXUS</span>
                </div>
            </motion.div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-8 border-t border-white/5">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black tracking-tight text-white font-headline uppercase italic">Painel de Controle</h2>
                        <p className="text-xs text-slate-500 uppercase tracking-[0.2em] font-bold">Gestão de Performance Operacional</p>
                    </div>
                </div>
                <Button variant="ghost" asChild className="text-slate-500 hover:text-white group bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl px-6 h-12">
                    <Link href="/intelligence">
                        <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Voltar ao Hub
                    </Link>
                </Button>
            </div>

            <Tabs defaultValue="efetivos" className="w-full">
                <TabsList className="bg-slate-900 border border-white/5 p-1 rounded-2xl mb-8">
                    <TabsTrigger value="efetivos" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-bold uppercase tracking-widest text-[10px]">
                        <Users className="h-4 w-4 mr-2" /> Base de Efetivos
                    </TabsTrigger>
                    <TabsTrigger value="historico" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-bold uppercase tracking-widest text-[10px]">
                        <Clock className="h-4 w-4 mr-2" /> Histórico de Avaliações
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="efetivos" className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <Input 
                                placeholder="Buscar colaborador..." 
                                className="pl-10 bg-slate-900/50 border-white/10 text-white rounded-xl"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Button variant="outline" className="border-white/10 text-slate-400 hover:text-white rounded-xl flex-1 md:flex-none">
                                <Filter className="h-4 w-4 mr-2" /> Filtrar Setor
                            </Button>
                            <Button 
                                onClick={() => setIsCadastroModalOpen(true)}
                                className="bg-primary text-black font-bold rounded-xl flex-1 md:flex-none"
                            >
                                <PlusCircle className="h-4 w-4 mr-2" /> Novo Cadastro
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEmployees.map((emp) => (
                            <Card key={emp.id} className="bg-slate-900/40 border-white/5 backdrop-blur-xl hover:border-primary/30 transition-all duration-300 rounded-[32px] overflow-hidden group">
                                <CardHeader className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="relative group/avatar">
                                            <Avatar className="h-14 w-14 border-2 border-primary/20 shadow-xl transition-all group-hover/avatar:border-primary/50">
                                                <AvatarImage src={emp.avatar} />
                                                <AvatarFallback className="bg-primary/20 text-primary font-bold">{emp.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <button 
                                                onClick={() => alert(`Simulando upload de foto para: ${emp.name}`)}
                                                className="absolute -bottom-1 -right-1 h-6 w-6 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center text-slate-500 hover:text-primary transition-colors shadow-lg"
                                            >
                                                <Camera className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <Badge className={cn(
                                            "text-[9px] font-black uppercase tracking-widest",
                                            emp.status === 'active' ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                                        )}>
                                            {emp.status === 'active' ? 'Efetivo' : 'Experiência'}
                                        </Badge>
                                    </div>
                                    <div className="mt-4">
                                        <CardTitle className="text-xl font-black text-white font-headline uppercase">{emp.name}</CardTitle>
                                        <CardDescription className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">{emp.role} // {emp.department}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-6 pb-6 space-y-4">
                                    <div className="flex justify-between items-end p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">IMN Atual</p>
                                            <p className="text-2xl font-black text-primary">{emp.meritScore.toFixed(1)}</p>
                                        </div>
                                        <TrendingUp className="h-6 w-6 text-emerald-500/40" />
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <Button asChild className="flex-1 bg-primary hover:bg-primary/80 text-black font-black uppercase tracking-widest text-[10px] rounded-xl h-10">
                                            <Link href={`/intelligence/merito/novo?employeeId=${emp.id}`}>
                                                Avaliar Mérito
                                            </Link>
                                        </Button>
                                        <Button variant="outline" className="border-white/10 text-slate-400 hover:text-white rounded-xl h-10 w-10 p-0">
                                            <ArrowUpRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="historico">
                    <Card className="bg-zinc-950/60 border-2 border-primary/20 backdrop-blur-md shadow-xl shadow-black/40 rounded-[32px]">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Avaliações Conduzidas</span>
                                <Button asChild>
                                    <Link href="/intelligence/merito">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Nova Avaliação
                                    </Link>
                                </Button>
                            </CardTitle>
                            <CardDescription>
                                Visualize, imprima e gerencie os certificados de mérito de sua equipe.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading && (
                                <div className="flex justify-center items-center h-40">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            )}
                            {!isLoading && error && (
                                <div className="text-center py-10 px-4 bg-destructive/10 rounded-lg">
                                    <ServerCrash className="mx-auto h-12 w-12 text-destructive" />
                                    <h3 className="mt-2 text-lg font-semibold text-destructive-foreground">Erro ao carregar avaliações.</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">Não foi possível buscar os registros. Verifique as permissões do seu usuário.</p>
                                </div>
                            )}
                            {!isLoading && !error && evaluations && (
                                evaluations.length === 0 ? (
                                    <div className="text-center py-10 px-4 border-2 border-dashed border-white/5 rounded-[32px]">
                                        <FileText className="mx-auto h-12 w-12 text-slate-700" />
                                        <h3 className="mt-2 text-lg font-semibold text-white">Nenhum registro encontrado.</h3>
                                        <p className="mt-1 text-sm text-slate-500">Você ainda não conduziu nenhuma avaliação de mérito para este período.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {evaluations.map(eva => (
                                            <Card key={eva.id} className="bg-zinc-900/50 border-2 border-primary/10 hover:border-primary/40 hover:scale-[1.02] transition-all duration-300 shadow-lg group">
                                                <CardHeader>
                                                    <CardTitle className="flex items-start justify-between">
                                                        <span className="font-headline text-lg text-white">{eva.employeeName}</span>
                                                        <Award className="h-6 w-6 text-primary" />
                                                    </CardTitle>
                                                    <CardDescription>
                                                        Avaliado em {format(new Date(eva.evaluationDate), "dd/MM/yyyy", { locale: ptBR })}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-sm text-muted-foreground">Índice de Mérito Nexus (IMN)</p>
                                                    <p className="text-3xl font-bold text-primary">{eva.finalMeritIndex.toFixed(1)}</p>
                                                </CardContent>
                                                <CardContent>
                                                    <Button asChild className="w-full" variant="outline">
                                                        <Link href={`/intelligence/merito/view?id=${eva.id}`}>
                                                            Ver Certificado
                                                        </Link>
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            <div className="max-w-7xl mx-auto px-6 pb-24 mt-12">
                <LegalSafeguard module="ENGENHARIA DE MÉRITO" protocol="NX-MERIT-01" />
            </div>

            {/* Modal Novo Cadastro */}
            {isCadastroModalOpen && (
                <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <Card className="w-full max-w-md bg-zinc-950 border-2 border-primary/20 shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-xl font-headline text-white flex items-center gap-2">
                                <PlusCircle className="h-5 w-5 text-primary" /> Efetivar Colaborador
                            </CardTitle>
                            <CardDescription>Cadastre o novo funcionário na base da Engenharia de Mérito.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs text-gray-300 font-bold uppercase">Nome do Colaborador</label>
                                <Input 
                                    value={newEmpData.name}
                                    onChange={(e) => setNewEmpData({...newEmpData, name: e.target.value})}
                                    placeholder="Ex: Leticia Braga..." 
                                    className="bg-black/40 border-white/10" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-300 font-bold uppercase">Cargo</label>
                                <Input 
                                    value={newEmpData.role}
                                    onChange={(e) => setNewEmpData({...newEmpData, role: e.target.value})}
                                    placeholder="Ex: Analista de Qualidade" 
                                    className="bg-black/40 border-white/10" 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-300 font-bold uppercase">Departamento</label>
                                    <select 
                                        value={newEmpData.department}
                                        onChange={(e) => setNewEmpData({...newEmpData, department: e.target.value})}
                                        className="w-full h-10 px-3 rounded-md bg-black/40 border border-white/10 text-white text-sm"
                                    >
                                        <option value="Qualidade" className="bg-zinc-950">Qualidade</option>
                                        <option value="Produção" className="bg-zinc-950">Produção</option>
                                        <option value="Logística" className="bg-zinc-950">Logística</option>
                                        <option value="Manutenção" className="bg-zinc-950">Manutenção</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-300 font-bold uppercase">IMN de Entrada</label>
                                    <Input 
                                        type="number"
                                        step="0.1"
                                        min="1"
                                        max="10"
                                        value={newEmpData.meritScore}
                                        onChange={(e) => setNewEmpData({...newEmpData, meritScore: Number(e.target.value)})}
                                        className="bg-black/40 border-white/10" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-300 font-bold uppercase">Data de Admissão</label>
                                <Input 
                                    type="date"
                                    value={newEmpData.admissionDate}
                                    onChange={(e) => setNewEmpData({...newEmpData, admissionDate: e.target.value})}
                                    className="bg-black/40 border-white/10" 
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button variant="ghost" onClick={() => setIsCadastroModalOpen(false)} className="flex-1 text-gray-400">
                                    Cancelar
                                </Button>
                                <Button onClick={handleAddEmployee} className="flex-1 bg-primary text-black font-black uppercase tracking-widest">
                                    Cadastrar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
            </div>
        </SovereignShowcase>
    );
}
