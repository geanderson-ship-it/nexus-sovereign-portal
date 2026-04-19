'use client';

import { useState, useRef, useEffect, FormEvent, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, User, Loader2, Hammer, Ruler, Package, Info, ShieldCheck, X, Maximize, Minimize, ChevronRight, HardHat, Camera as CameraIcon, Cpu, Zap, Microscope, FileText, Settings, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { danteBuilderChat, generateDanteBuilderImage } from '@/ai/flows/dante-builder-flow';
import type { DanteBuilderChatOutput } from '@/ai/flows/dante-builder-types';
import placeholderImages from '@/lib/placeholder-images.json';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/hooks/use-locale';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Sender = 'user' | 'system';

interface Message {
  id: number;
  sender: Sender;
  data: { text: string } | DanteBuilderChatOutput;
  isImageLoading?: boolean;
}

export default function DanteBuilderChat() {
  const { user } = useUser();
  const { t } = useLocale();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<{ proposal: any, imageUri?: string } | null>(null);
  const [builderParams, setBuilderParams] = useState({
    product: '', altura: '', largura: '', context: '', color: '', glass: '', finish: '', handle: '', lock: ''
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const userInitials = useMemo(() => {
    if (!user?.displayName) return 'U';
    const names = user.displayName.split(' ');
    const initials = names.map((n) => n[0]).join('');
    return initials.slice(0, 2).toUpperCase();
  }, [user]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }, [messages]);

  const addMessage = useCallback((sender: Sender, data: { text: string } | DanteBuilderChatOutput) => {
    const newMessage: Message = {
      id: Date.now(),
      sender,
      data,
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const processMessage = useCallback(async (text: string) => {
    if (!text || !text.trim()) return;

    const currentInput = text;
    
    const lastSystemMessage = messages.filter(m => m.sender === 'system').pop();
    let historyContext = undefined;
    if (lastSystemMessage) {
        const data = lastSystemMessage.data as DanteBuilderChatOutput;
        if (data.response) {
            historyContext = `Descrição Original: ${data.response}\nEspecificações: ${JSON.stringify(data.specifications)}\nLista de Materiais: ${JSON.stringify(data.materialList)}\nDetalhes da Proposta Arquitetônica Atual (Para Herança): ${JSON.stringify(data.proposals)}`;
        }
    }

    addMessage('user', { text: currentInput });
    setInput('');
    setIsLoading(true);

    try {
      const response: DanteBuilderChatOutput = await danteBuilderChat({
        userMessage: currentInput,
        historyContext: historyContext,
      });
      
      if (!response || !response.response) {
        throw new Error("Falha no protocolo de resposta.");
      }

      addMessage('system', response);
    } catch (error: any) {
      const errorText = `ERRO DE ENGENHARIA: ${error.message || 'Instabilidade no sistema.'}`;
      addMessage('system', { response: errorText });
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, messages]);

  const handleGenerateImage = async (messageId: number, proposals: any[]) => {
    setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, isImageLoading: true } : msg));
    
    try {
        const imageUris = await Promise.all(proposals.map(p => generateDanteBuilderImage(p.imagePrompt)));
        setMessages(prev => prev.map(msg => {
            if (msg.id === messageId) {
                return { 
                    ...msg, 
                    isImageLoading: false, 
                    data: { ...msg.data, imageUris } as DanteBuilderChatOutput 
                };
            }
            return msg;
        }));
    } catch (error) {
        console.error("Erro ao gerar imagem:", error);
        setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, isImageLoading: false } : msg));
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    let combinedInput = input.trim();
    const hasParams = Object.values(builderParams).some(val => val !== '');
    
    if (hasParams) {
        const labels: Record<string, string> = {
            product: 'Produto', altura: 'Altura', largura: 'Largura', context: 'Contexto', color: 'Cor', glass: 'Vidro', 
            finish: 'Acabamento', handle: 'Puxadores', lock: 'Tranca'
        };
        const paramsText = Object.entries(builderParams)
            .filter(([_, val]) => val !== '')
            .map(([key, val]) => `${labels[key]}: ${val}`)
            .join(' | ');
            
        combinedInput = `[PARÂMETROS DEFINIDOS] ${paramsText}.\nObservações Adicionais: ${combinedInput || 'Nenhuma.'}`;
    }

    if (!combinedInput) return;
    
    processMessage(combinedInput);
    // Não limpa os selects intencionalmente para revisões, apenas a caixa de texto
  };

  const renderMaterialList = (materials: any[]) => (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">
        <Package className="h-3 w-3" />
        Lista de Materiais Sugerida
      </div>
      <div className="grid grid-cols-1 gap-2">
        {materials.map((m, i) => (
          <div key={i} className="p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-lg flex flex-col gap-1">
            <div className="flex justify-between items-start">
                <span className="text-white font-bold text-xs uppercase">{m.item}</span>
                <Badge variant="outline" className="text-[9px] border-cyan-500/30 text-cyan-300 bg-cyan-500/10">QT: {m.quantity}</Badge>
            </div>
            <p className="text-[10px] text-gray-400 italic">"{m.reason}"</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSpecs = (specs: any) => (
    <div className="grid grid-cols-2 gap-2 mt-4">
        {specs.line && (
            <div className="p-2 bg-black/40 border border-white/5 rounded-lg">
                <p className="text-[8px] text-gray-500 uppercase font-bold">Linha / Base</p>
                <p className="text-[10px] text-cyan-300 font-mono">{specs.line}</p>
            </div>
        )}
        {specs.dimensions && (
            <div className="p-2 bg-black/40 border border-white/5 rounded-lg">
                <p className="text-[8px] text-gray-500 uppercase font-bold">Dimensões</p>
                <p className="text-[10px] text-cyan-300 font-mono">{specs.dimensions}</p>
            </div>
        )}
        {specs.finish && (
            <div className="p-2 bg-black/40 border border-white/5 rounded-lg">
                <p className="text-[8px] text-gray-500 uppercase font-bold">Acabamento</p>
                <p className="text-[10px] text-cyan-300 font-mono">{specs.finish}</p>
            </div>
        )}
        {specs.glass && (
            <div className="p-2 bg-black/40 border border-white/5 rounded-lg">
                <p className="text-[8px] text-gray-500 uppercase font-bold">Componente / Vidro</p>
                <p className="text-[10px] text-cyan-300 font-mono">{specs.glass}</p>
            </div>
        )}
    </div>
  );

  const renderImageGen = (msg: Message) => {
    const data = msg.data as DanteBuilderChatOutput;
    if (!data.proposals || (data.imageUris && data.imageUris.length > 0)) return null;

    return (
        <div className="mt-4 p-4 border border-dashed border-cyan-500/30 rounded-xl bg-cyan-500/5 flex flex-col items-center gap-3">
            <div className="text-center">
                <p className="text-[10px] text-cyan-300 uppercase font-bold tracking-widest">{t('danteBuilder.visualModelTitle')}</p>
                <p className="text-[9px] text-gray-500">Renderize as 3 propostas de ruptura exclusiva criadas pelo Dante.</p>
            </div>
            <Button 
                onClick={() => handleGenerateImage(msg.id, data.proposals!)} 
                disabled={msg.isImageLoading}
                className="bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold uppercase tracking-widest h-8 px-4"
            >
                {msg.isImageLoading ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <CameraIcon className="h-3 w-3 mr-2" />}
                {msg.isImageLoading ? t('danteBuilder.generatingImage') : "RENDERIZAR PROPOSTAS INOVADORAS"}
            </Button>
        </div>
    );
  };

  const renderGeneratedImages = (imageUris: string[], proposals?: any[]) => {
    return (
    <div className="mt-4 space-y-6">
        {imageUris.map((imageUri, index) => {
            const proposal = proposals?.[index];
            const title = proposal?.title || `Proposta Concept ${index + 1}`;
            const safeSrc = imageUri.startsWith('data:') || imageUri.startsWith('http') 
                ? imageUri 
                : `data:image/jpeg;base64,${imageUri}`;

            return (
                <div key={index} className="relative group">
                    <div className="absolute -top-3 -bottom-auto sm:-right-3 sm:top-auto sm:right-auto z-20 bg-cyan-600 text-[8px] font-bold text-white px-2 py-0.5 rounded border border-white/20 shadow-[0_0_10px_rgba(6,182,212,0.5)] uppercase tracking-widest">
                        Model v3.3 - {title}
                    </div>
                    <div className="rounded-xl border border-cyan-500/30 bg-zinc-950 p-2 relative flex flex-col items-center justify-center min-h-[200px] overflow-hidden group-hover:border-cyan-500/60 transition-all">
                        <img 
                            src={safeSrc} 
                            alt={title} 
                            className="max-w-full rounded-lg object-contain max-h-[400px]"
                        />
                        
                        {proposal && (
                            <div className="mt-3 w-full px-2">
                                <Button 
                                    className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[9px] font-bold uppercase tracking-widest h-7"
                                    onClick={() => setSelectedProposal({ proposal, imageUri })}
                                >
                                    <Cpu className="h-3 w-3 mr-2" />
                                    DETALHAR ARSENAL DO FORNECEDOR
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            );
        })}
        <p className="text-[9px] text-gray-500 mt-2 text-center italic">Modelos de ruptura gerados simultaneamente pelo Motor de Inovação Dante Builder.</p>
    </div>
  )};

  return (
    <Card className={cn(
        "w-full max-w-4xl flex flex-col shadow-2xl border-cyan-800/60 relative bg-black",
        isMaximized ? "fixed inset-0 z-50 max-w-full h-full rounded-none" : "h-[80vh]"
    )}>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full text-white">
        <CardHeader className="flex flex-row items-center gap-4 bg-zinc-950/80 backdrop-blur-md border-b border-cyan-900/40 py-4">
          <div className="relative">
            <Avatar className="h-14 w-14 border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <AvatarImage src={placeholderImages['dante-builder'].src} alt="Dante Builder" />
                <AvatarFallback className="bg-cyan-900 text-white font-bold">DB</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-cyan-500 rounded-full p-1 border-2 border-black">
                <Hammer className="h-3 w-3 text-black" />
            </div>
          </div>
          <div className="flex-1">
            <CardTitle className="font-headline text-xl text-cyan-400 tracking-tight flex items-center gap-2 uppercase italic">
                Dante Builder <span className="text-[10px] bg-cyan-400/20 px-2 py-0.5 rounded border border-cyan-500/30 not-italic tracking-widest text-white">CONTEXTUAL v3.3</span>
            </CardTitle>
            <CardDescription className="text-gray-400 text-xs font-mono uppercase tracking-widest">Architectural Alchemist: Urbano • Empresarial • Campo</CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-cyan-400" onClick={() => setIsMaximized(!isMaximized)}>
               {isMaximized ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
             <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-400" onClick={() => router.back()}>
                <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <ScrollArea className="flex-1 px-4 py-6">
            <div className="max-w-3xl mx-auto space-y-8 pb-10">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center text-center space-y-4 py-10 opacity-60">
                         <div className="p-4 bg-cyan-500/10 rounded-full">
                            <Ruler className="h-10 w-10 text-cyan-500" />
                         </div>
                         <h3 className="text-cyan-400 font-headline text-lg uppercase tracking-[0.3em]">Protocolo de Construção Ativo</h3>
                         <p className="text-xs text-gray-400 max-w-sm">Me diga quais aberturas você precisa. Eu criarei 3 propostas de luxo com o arsenal técnico completo para seu fornecedor.</p>
                    </div>
                )}

                {messages.map((msg) => {
                    const isSystem = msg.sender === 'system';
                    const data = msg.data as any;
                    const text = isSystem ? data.response : data.text;

                    return (
                        <div key={msg.id} className={cn("flex flex-col", isSystem ? "items-start" : "items-end")}>
                            <div className={cn("flex gap-3 max-w-[90%]", isSystem ? "flex-row" : "flex-row-reverse")}>
                                <Avatar className="h-8 w-8 shrink-0 mt-1 border border-white/10">
                                    <AvatarImage src={isSystem ? placeholderImages['dante-builder'].src : (user?.photoURL ?? undefined)} />
                                    <AvatarFallback className={isSystem ? "bg-cyan-900" : "bg-zinc-800"}>{isSystem ? 'DB' : userInitials}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-4 flex-1">
                                    <div className={cn(
                                        "px-5 py-3 rounded-2xl text-sm leading-relaxed",
                                        isSystem 
                                            ? "bg-zinc-900 border border-cyan-900/20 text-gray-200 rounded-tl-none shadow-xl" 
                                            : "bg-cyan-600 text-white rounded-tr-none shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                                    )}>
                                        <p className="whitespace-pre-wrap">{text}</p>
                                    </div>
                                    
                                    {isSystem && data.specifications && renderSpecs(data.specifications)}
                                    {isSystem && data.materialList && renderMaterialList(data.materialList)}
                                    {isSystem && renderImageGen(msg)}
                                    {isSystem && data.imageUris && data.imageUris.length > 0 && renderGeneratedImages(data.imageUris, data.proposals)}
                                </div>
                            </div>
                        </div>
                    );
                })}
                
                {isLoading && (
                    <div className="flex gap-3 items-start animate-pulse">
                         <Avatar className="h-8 w-8 shrink-0 border border-white/10">
                            <Loader2 className="h-4 w-4 animate-spin text-cyan-400 m-auto" />
                         </Avatar>
                         <div className="bg-zinc-900 border border-cyan-900/20 h-12 w-32 rounded-2xl rounded-tl-none" />
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>
        </ScrollArea>

        <CardFooter className="p-6 bg-zinc-950/80 backdrop-blur-md border-t border-cyan-900/40">
            <div className="max-w-3xl mx-auto w-full space-y-4">
                <form onSubmit={handleFormSubmit} className="relative flex flex-col gap-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 px-1">
                        <Select value={builderParams.product} onValueChange={(v) => setBuilderParams({...builderParams, product: v})}>
                            <SelectTrigger className="bg-black/50 border-cyan-900/50 text-[10px] uppercase tracking-widest text-cyan-400 h-8 px-2"><SelectValue placeholder="Produto" /></SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-cyan-900/50 text-gray-300">
                                <SelectItem value="Porta">Porta</SelectItem>
                                <SelectItem value="Janela">Janela</SelectItem>
                                <SelectItem value="Fachada">Fachada</SelectItem>
                                <SelectItem value="Divisória">Divisória</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex items-center justify-between bg-black/50 border border-cyan-900/50 rounded-md px-1.5 h-8 focus-within:ring-1 focus-within:ring-cyan-500/20">
                            <span className="text-[9px] text-cyan-600 font-bold mr-1">A</span>
                            <input 
                                id="altura-input"
                                type="text"
                                maxLength={5}
                                value={builderParams.altura} 
                                onChange={(e) => {
                                    let val = e.target.value.replace(/[^0-9,.]/g, '');
                                    setBuilderParams({...builderParams, altura: val});
                                    if (val.replace(/[,.]/g, '').length >= 3) {
                                        document.getElementById('largura-input')?.focus();
                                    }
                                }}
                                onBlur={() => {
                                    let val = builderParams.altura.replace(',', '.').replace('m', '');
                                    let num = parseFloat(val);
                                    if (!isNaN(num)) setBuilderParams(p => ({ ...p, altura: num.toFixed(2).replace('.', ',') + 'm' }));
                                    else setBuilderParams(p => ({ ...p, altura: '' }));
                                }}
                                onFocus={(e) => {
                                    setBuilderParams(p => ({...p, altura: p.altura.replace('m', '')}));
                                }}
                                placeholder="--"
                                className="w-full bg-transparent outline-none text-[10px] text-cyan-400 placeholder:text-cyan-900/60"
                            />
                            <div className="w-[1px] h-4 bg-cyan-900/30 mx-1"></div>
                            <span className="text-[9px] text-cyan-600 font-bold mr-1">L</span>
                            <input 
                                id="largura-input"
                                type="text"
                                maxLength={5}
                                value={builderParams.largura} 
                                onChange={(e) => {
                                    let val = e.target.value.replace(/[^0-9,.]/g, '');
                                    setBuilderParams({...builderParams, largura: val});
                                }}
                                onBlur={() => {
                                    let val = builderParams.largura.replace(',', '.').replace('m', '');
                                    let num = parseFloat(val);
                                    if (!isNaN(num)) setBuilderParams(p => ({ ...p, largura: num.toFixed(2).replace('.', ',') + 'm' }));
                                    else setBuilderParams(p => ({ ...p, largura: '' }));
                                }}
                                onFocus={(e) => {
                                    setBuilderParams(p => ({...p, largura: p.largura.replace('m', '')}));
                                }}
                                placeholder="--"
                                className="w-full bg-transparent outline-none text-[10px] text-cyan-400 placeholder:text-cyan-900/60"
                            />
                        </div>
                        <Select value={builderParams.context} onValueChange={(v) => setBuilderParams({...builderParams, context: v})}>
                            <SelectTrigger className="bg-black/50 border-cyan-900/50 text-[10px] uppercase tracking-widest text-cyan-400 h-8 px-2"><SelectValue placeholder="Contexto" /></SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-cyan-900/50 text-gray-300">
                                <SelectItem value="Urbano/Apt">Urbano</SelectItem>
                                <SelectItem value="Rural/Campo">Campo</SelectItem>
                                <SelectItem value="Empresarial">Empresa</SelectItem>
                                <SelectItem value="Litoral">Litoral</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={builderParams.color} onValueChange={(v) => setBuilderParams({...builderParams, color: v})}>
                            <SelectTrigger className="bg-black/50 border-cyan-900/50 text-[10px] uppercase tracking-widest text-cyan-400 h-8 px-2"><SelectValue placeholder="Cor" /></SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-cyan-900/50 text-gray-300">
                                <SelectItem value="Branca">Branca</SelectItem>
                                <SelectItem value="Preta">Preta</SelectItem>
                                <SelectItem value="Bronze">Bronze</SelectItem>
                                <SelectItem value="Amadeirado">Amadeirado</SelectItem>
                                <SelectItem value="Prata/Inox">Prata/Inox</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={builderParams.glass} onValueChange={(v) => setBuilderParams({...builderParams, glass: v})}>
                            <SelectTrigger className="bg-black/50 border-cyan-900/50 text-[10px] uppercase tracking-widest text-cyan-400 h-8 px-2"><SelectValue placeholder="Vidro" /></SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-cyan-900/50 text-gray-300">
                                <SelectItem value="Sem Vidro">Sem Vidro</SelectItem>
                                <SelectItem value="Temperado Incolor">Temp. Incolor</SelectItem>
                                <SelectItem value="Laminado">Laminado</SelectItem>
                                <SelectItem value="Refletivo">Refletivo</SelectItem>
                                <SelectItem value="Canelado/Fumê">Fumê/Canel.</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={builderParams.finish} onValueChange={(v) => setBuilderParams({...builderParams, finish: v})}>
                            <SelectTrigger className="bg-black/50 border-cyan-900/50 text-[10px] uppercase tracking-widest text-cyan-400 h-8 px-2"><SelectValue placeholder="Acabam." /></SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-cyan-900/50 text-gray-300">
                                <SelectItem value="Fosco">Fosco</SelectItem>
                                <SelectItem value="Brilhante">Brilhante</SelectItem>
                                <SelectItem value="Acetinado">Acetinado</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={builderParams.handle} onValueChange={(v) => setBuilderParams({...builderParams, handle: v})}>
                            <SelectTrigger className="bg-black/50 border-cyan-900/50 text-[10px] uppercase tracking-widest text-cyan-400 h-8 px-2"><SelectValue placeholder="Puxador" /></SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-cyan-900/50 text-gray-300">
                                <SelectItem value="Aço Escovado">Aço Escov.</SelectItem>
                                <SelectItem value="Inox Polido">Inox Pol.</SelectItem>
                                <SelectItem value="Preto Fosco">Preto</SelectItem>
                                <SelectItem value="Cava/Invisível">Cava/Invis.</SelectItem>
                                <SelectItem value="Sem Puxador">Sem Puxador</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={builderParams.lock} onValueChange={(v) => setBuilderParams({...builderParams, lock: v})}>
                            <SelectTrigger className="bg-black/50 border-cyan-900/50 text-[10px] uppercase tracking-widest text-cyan-400 h-8 px-2"><SelectValue placeholder="Tranca" /></SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-cyan-900/50 text-gray-300">
                                <SelectItem value="Biométrica">Biométrica</SelectItem>
                                <SelectItem value="Multiponto">Multiponto</SelectItem>
                                <SelectItem value="Chave Tetra">Tetra</SelectItem>
                                <SelectItem value="Smart Lock">Smart Lock</SelectItem>
                                <SelectItem value="Padrão">Padrão</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="relative flex items-end gap-2 w-full">
                        <Textarea
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleFormSubmit(e); } }}
                            placeholder="Descreva observações secundárias do seu projeto..."
                            autoComplete="off"
                            disabled={isLoading}
                            rows={1}
                            className="min-h-[60px] max-h-40 resize-none bg-black/60 border-cyan-900/50 text-gray-200 placeholder:text-zinc-600 focus:border-cyan-500 focus:ring-cyan-500/20 pr-14 w-full"
                        />
                        <Button 
                            type="submit" 
                            size="icon" 
                            disabled={isLoading || (!input.trim() && !Object.values(builderParams).some(v => v !== ''))} 
                            className="absolute bottom-2.5 right-2.5 h-10 w-10 bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20"
                        >
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                        </Button>
                    </div>
                </form>
                
                <div className="flex justify-between items-center px-1">
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                         <ShieldCheck className="h-3 w-3" /> Protocolo Nexus Active - Arsenal Mod Ativo
                    </p>
                    <div className="flex gap-4">
                        <span className="text-[9px] text-cyan-500 font-bold uppercase tracking-widest">Master Engineer</span>
                        <span className="text-[9px] text-cyan-500 font-bold uppercase tracking-widest">Supplier-Link v1</span>
                    </div>
                </div>
            </div>
        </CardFooter>

        {/* Arsenal Dialog */}
        <Dialog open={!!selectedProposal} onOpenChange={(open) => !open && setSelectedProposal(null)}>
            <DialogContent className="max-w-4xl bg-zinc-950 border-cyan-500/30 text-white p-0 overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.2)]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.1] pointer-events-none" />
                
                {selectedProposal && (
                    <div className="relative z-10 flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-cyan-500/20 bg-black/40 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-gray-400 hover:text-white border border-white/10"
                                    onClick={() => setSelectedProposal(null)}
                                >
                                    <ChevronRight className="h-4 w-4 rotate-180 mr-2" />
                                    VOLTAR
                                </Button>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-cyan-400 border-cyan-500/40 bg-cyan-500/5 text-[10px] uppercase font-bold tracking-widest">
                                            Dossiê Técnico Confidencial
                                        </Badge>
                                        <Badge className="bg-zinc-800 text-zinc-400 text-[9px] border-none">v3.3 Contextual</Badge>
                                    </div>
                                    <DialogTitle className="text-2xl font-headline text-white uppercase italic tracking-tight">
                                        {selectedProposal.proposal.title}
                                    </DialogTitle>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge className={cn(
                                    "text-[10px] font-bold uppercase tracking-widest border-2 py-1 px-3",
                                    selectedProposal.proposal.technicalArsenal.complexity === 'Masterpiece' ? "bg-amber-500/20 text-amber-500 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]" :
                                    selectedProposal.proposal.technicalArsenal.complexity === 'Advanced' ? "bg-cyan-500/20 text-cyan-500 border-cyan-500/40" :
                                    "bg-zinc-500/20 text-zinc-500 border-zinc-500/40"
                                )}>
                                    {selectedProposal.proposal.technicalArsenal.complexity} Level
                                </Badge>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-gray-500 hover:text-red-400" 
                                    onClick={() => setSelectedProposal(null)}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        <ScrollArea className="flex-1 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                                            <Zap className="h-3 w-3" /> Notas de Engenharia
                                        </h4>
                                        <div className="p-4 bg-zinc-900/80 border border-white/5 rounded-xl text-sm text-gray-300 leading-relaxed font-mono">
                                            {selectedProposal.proposal.technicalArsenal.engineeringNotes}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                                            <Settings className="h-3 w-3" /> Especificações do Projeto
                                        </h4>
                                        <div className="space-y-2">
                                            {selectedProposal.proposal.technicalArsenal.preciseSpecs.map((spec: string, i: number) => (
                                                <div key={i} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg group hover:border-cyan-500/40 transition-colors">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 shadow-[0_0_5px_cyan]" />
                                                    <span className="text-[11px] font-mono text-gray-200">{spec}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedProposal.proposal.technicalArsenal.billOfMaterials && (
                                        <div className="space-y-3">
                                            <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                                                <Package className="h-3 w-3" /> Arsenal de Componentes (Eng. 50 anos)
                                            </h4>
                                            <div className="rounded-xl border border-white/10 overflow-hidden text-[10px]">
                                                <table className="w-full text-left">
                                                    <thead className="bg-white/5 text-gray-400 uppercase tracking-tighter">
                                                        <tr>
                                                            <th className="p-2 border-b border-white/10">Item</th>
                                                            <th className="p-2 border-b border-white/10">Qtd</th>
                                                            <th className="p-2 border-b border-white/10">Detalhes Técnicos</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-white/5">
                                                        {selectedProposal.proposal.technicalArsenal.billOfMaterials.map((item: any, i: number) => (
                                                            <tr key={i} className="hover:bg-cyan-500/5 transition-colors">
                                                                <td className="p-2 font-bold text-white whitespace-nowrap">{item.item}</td>
                                                                <td className="p-2 text-cyan-400 font-mono">{item.quantity}</td>
                                                                <td className="p-2 text-gray-400 italic leading-tight text-[9px]">{item.details}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div className="rounded-xl border border-white/10 overflow-hidden bg-black aspect-square flex items-center justify-center">
                                        {selectedProposal.imageUri && (
                                            <img 
                                                src={selectedProposal.imageUri.startsWith('data:') || selectedProposal.imageUri.startsWith('http') ? selectedProposal.imageUri : `data:image/jpeg;base64,${selectedProposal.imageUri}`} 
                                                alt="Reference" 
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>

                                    <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-2">
                                        <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500">
                                            <Microscope className="h-3 w-3" /> Dica do Mestre (Segredos de Obra)
                                        </h4>
                                        <p className="text-xs text-amber-200/80 italic leading-relaxed">
                                            "{selectedProposal.proposal.technicalArsenal.supplierTip}"
                                        </p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-2">
                                        <Button 
                                            className="w-full bg-white text-black hover:bg-gray-200 text-xs font-bold uppercase tracking-widest h-10 shadow-[0_5px_15px_rgba(255,255,255,0.1)] transition-all hover:-translate-y-0.5"
                                            onClick={() => window.print()}
                                        >
                                            <FileText className="h-4 w-4 mr-2" />
                                            GERAR PDF TÉCNICO
                                        </Button>

                                        <Button 
                                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest h-10 shadow-[0_5px_15px_rgba(16,185,129,0.2)] transition-all hover:-translate-y-0.5"
                                            onClick={() => {
                                                const context = {
                                                    title: selectedProposal.proposal.title,
                                                    materials: selectedProposal.proposal.technicalArsenal.billOfMaterials
                                                };
                                                localStorage.setItem('nexus_builder_quote_context', JSON.stringify(context));
                                                router.push('/intelligence/compras');
                                            }}
                                        >
                                            <ShoppingCart className="h-4 w-4 mr-2" />
                                            COTAR MATERIAIS NO DANTE COMPRAS
                                        </Button>
                                    </div>
                                    
                                    <p className="text-[8px] text-gray-600 text-center uppercase tracking-widest italic pt-2">
                                        Documentação gerada sob Protocolo Nexus Arquiteto-Engenheiro.
                                    </p>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                )}
            </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
