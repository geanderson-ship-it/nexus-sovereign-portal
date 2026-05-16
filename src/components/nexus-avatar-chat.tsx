
'use client';

import React, { useState, useRef, useEffect, FormEvent, useMemo, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Send, User, Loader2, Maximize, Minimize, Volume2, Mic, Pause, BookOpen, Camera as CameraIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

// AI Flow imports
import { djenyChat } from '@/ai/flows/djeny-chat-flow';
import { danteChat } from '@/ai/flows/dante-chat-flow';
import { clanChat } from '@/ai/flows/clan-chat-flow';
import { careerChat } from '@/ai/flows/career-chat-flow';
import { danteComprasChat } from '@/ai/flows/dante-compras-chat-flow';
import { danteBuilderChat } from '@/ai/flows/dante-builder-flow';
import { danteInstrutorChat } from '@/ai/flows/dante-instrutor-flow';
import { djenyInstrutorChat } from '@/ai/flows/djeny-instrutor-flow';

// Types
import type { DjenyChatOutput, DjenyConversationStage } from '@/ai/flows/djeny-chat-types';
import type { DanteChatOutput, DanteConversationStage } from '@/ai/flows/dante-chat-types';
import type { ClanChatOutput } from '@/ai/flows/clan-chat-types';
import type { CareerChatOutput } from '@/ai/flows/career-chat-types';
import type { DanteComprasChatOutput } from '@/ai/flows/dante-compras-chat-types';
import type { DanteBuilderChatOutput } from '@/ai/flows/dante-builder-types';
import type { DanteInstrutorChatOutput } from '@/ai/flows/dante-instrutor-types';
import type { DjenyInstrutorChatOutput } from '@/ai/flows/djeny-instrutor-types';
import { type AIContext } from '@/lib/ai-contexts';
import { intentKeywords, emotionKeywords } from '@/lib/intent-library';

// Assets
import placeholderImages from '@/lib/placeholder-images.json';
import { useUser } from '@/auth';
import { eventEmitter } from '@/auth/event-emitter';
import { allCourses } from '@/lib/courses-data';
import { isAdminUser } from '@/lib/constants';
import { useNexusAudio } from '@/hooks/use-nexus-audio';
import * as gtag from '@/lib/gtag';


// --- Interfaces ---
type Sender = 'user' | 'system';
type AIOutput = DjenyChatOutput | DanteChatOutput | ClanChatOutput | CareerChatOutput | DanteComprasChatOutput | DanteBuilderChatOutput | DanteInstrutorChatOutput | DjenyInstrutorChatOutput;

interface Message {
  id: number;
  sender: Sender;
  data: (AIOutput | { text: string } | { response: string }) & { emotion?: 'urgent' | 'success' | 'alert' | 'normal', recommendedCourseSlug?: string };
  aiContext: AIContext;
  imageUri?: string;
}

const aiConfig: Record<AIContext, {
    name: string;
    description: string;
    avatar: string;
    avatarAlt: string;
    avatarFallback: string;
    borderColor: string;
    flow: (input: any) => Promise<any>;
}> = {
  djeny: {
    name: 'Djeny (A Estrategista)',
    description: 'Inteligência Emocional e Auditoria de Talentos.',
    avatar: placeholderImages.contact.src,
    avatarAlt: placeholderImages.contact.alt,
    avatarFallback: 'D',
    borderColor: 'border-accent',
    flow: djenyChat,
  },
  dante: {
    name: 'Dante (O Guardião)',
    description: 'Lógica. Dados. Decisão.',
    avatar: 'https://i.postimg.cc/FF8yZyFQ/dante-safra.jpg',
    avatarAlt: placeholderImages.dante.alt,
    avatarFallback: 'D',
    borderColor: 'border-gray-500',
    flow: danteChat,
  },
  clan: {
    name: 'Nexus Clan: Sala de Comando',
    description: 'Sua Mentoria Estratégica 24/7',
    avatar: 'clan',
    avatarAlt: 'Nexus Clan',
    avatarFallback: 'C',
    borderColor: 'border-primary',
    flow: clanChat,
  },
  career: {
    name: 'Djeny (Sua Estrategista)',
    description: 'Mentora de Carreira e Inteligência Emocional',
    avatar: placeholderImages.contact.src,
    avatarAlt: placeholderImages.contact.alt,
    avatarFallback: 'D',
    borderColor: 'border-accent',
    flow: careerChat,
  },
  'dante-compras': {
    name: 'Dante Compras (Negociação)',
    description: 'Análise e estratégia de negociação.',
    avatar: 'https://i.postimg.cc/FF8yZyFQ/dante-safra.jpg',
    avatarAlt: placeholderImages.dante.alt,
    avatarFallback: 'D',
    borderColor: 'border-emerald-500',
    flow: danteComprasChat,
  },
  'dante-builder': {
    name: 'Dante Builder (Mestre Construtor)',
    description: 'Design e Engenharia de Aberturas e Esquadrias.',
    avatar: placeholderImages['dante-builder'].src,
    avatarAlt: placeholderImages['dante-builder'].alt,
    avatarFallback: 'DB',
    borderColor: 'border-cyan-500',
    flow: danteBuilderChat,
  },
  'dante-instrutor': {
    name: 'Dante (O Instrutor)',
    description: 'Doutrina do Aço.',
    avatar: 'https://i.postimg.cc/0N4MbZm9/Instrutor-Dante.png',
    avatarAlt: 'Dante, o instrutor IA da Nexus.',
    avatarFallback: 'DI',
    borderColor: 'border-blue-500',
    flow: danteInstrutorChat,
  },
  'djeny-instrutor': {
    name: 'Djeny (A Instrutora)',
    description: 'Doutrina da Seda.',
    avatar: 'https://i.postimg.cc/15zQjS2p/Instrutora-Djeny.png',
    avatarAlt: 'Djeny, a instrutora IA da Nexus.',
    avatarFallback: 'DI',
    borderColor: 'border-accent',
    flow: djenyInstrutorChat,
  },
};

export function NexusAvatarChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeContext, setActiveContext] = useState<AIContext>('clan');
  const [contextData, setContextData] = useState<any>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  const [djenyStage, setDjenyStage] = useState<DjenyConversationStage>('AVALIACAO');
  const [danteStage, setDanteStage] = useState<DanteConversationStage>('AVALIACAO');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const { playAudio, stopAudio, isPlaying, isLoadingAudio, playingId, warmUpAudio } = useNexusAudio();

  // --- Logic Helpers ---
  const isDashboardPage = useMemo(() => {
    const dashboardPaths = ['/gabinete', '/intelligence', '/excellence'];
    return dashboardPaths.some(path => pathname?.startsWith(path));
  }, [pathname]);

  const config = aiConfig[activeContext];

  const disclaimerText = useMemo(() => {
    let text = "A IA pode cometer erros. Confira as respostas.";
    if (activeContext.startsWith('dante')) text = "O Dante é uma IA e pode cometer erros.";
    else if (activeContext.startsWith('djeny') || activeContext === 'career') text = "A Djeny é uma IA e pode cometer erros.";
    return `${text} O áudio pode demorar alguns instantes.`;
  }, [activeContext]);

  // --- Effects ---
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'pt-BR';
      recognition.interimResults = true;
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join('');
        setInput(transcript);
      };
      recognition.onend = () => setIsRecording(false);
      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (isOpen) {
        warmUpAudio();
        setCallDuration(0);
        timerId = setInterval(() => setCallDuration(prev => prev + 1), 1000);
        
        // Rastrear abertura do chat
        gtag.event({
            action: 'nexus_chat_open',
            category: 'Engagement',
            label: activeContext
        });
    }
    return () => clearInterval(timerId);
  }, [isOpen, warmUpAudio]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Data Queries ---
  const isAdmin = useMemo(() => isAdminUser(user), [user]);
  const hasAccessToMentoria = useMemo(() => isAdmin || !!user, [isAdmin, user]);
  const purchases: any[] = [];

  // --- Core Actions ---
  const addMessage = useCallback((sender: Sender, data: Message['data'], imageUri?: string) => {
    setMessages(prev => [...prev, { id: Date.now(), sender, data, aiContext: activeContext, imageUri }]);
  }, [activeContext]);

  const handleMicClick = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (isRecording) {
        recognition.stop();
    } else {
        // Rastrear uso de voz
        gtag.event({
            action: 'nexus_chat_voice_active',
            category: 'Engagement',
            label: activeContext
        });
        stopAudio();
        setInput('');
        recognition.start();
        setIsRecording(true);
    }
  };

  const handleSubmit = useCallback(async (e?: FormEvent, programmaticInput?: string, imageUri?: string) => {
    e?.preventDefault();
    const messageToSend = programmaticInput || input;
    if (!messageToSend.trim() && !imageUri) return;

    if(!programmaticInput) stopAudio();
    
    const historyForAI = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      text: (msg.data as any).response || (msg.data as any).text || '',
    })).slice(-10);

    addMessage('user', { text: messageToSend, emotion: 'normal' }, imageUri);
    if (!programmaticInput) setInput('');
    setIsLoading(true);

    // Rastrear primeira mensagem da sessão
    if (messages.length === 0) {
        gtag.event({
            action: 'nexus_chat_start',
            category: 'Engagement',
            label: activeContext
        });
    }

    // Rastrear upload de imagem
    if (imageUri) {
        gtag.event({
            action: 'nexus_chat_image_upload',
            category: 'Engagement',
            label: activeContext
        });
    }

    try {
        const flowInput: any = { 
          userMessage: messageToSend,
          photoDataUri: imageUri,
          userName: user?.displayName || (activeContext.startsWith('dante') ? 'Comandante' : 'Anjo')
        };
        
        // VIX Protocol: Selective Context Injection
        if (activeContext === 'dante') {
            flowInput.conversationStage = danteStage;
        } else if (activeContext === 'djeny') {
            flowInput.conversationStage = djenyStage;
        } else if (activeContext === 'clan') {
            flowInput.purchasedSlugs = isAdmin ? allCourses.map(c => c.slug) : purchases?.map(p => p.courseId) ?? [];
            flowInput.history = historyForAI;
        } else if (activeContext === 'dante-instrutor' || activeContext === 'djeny-instrutor') {
            if (contextData?.courseContext) {
                flowInput.courseContext = contextData.courseContext;
            }
            flowInput.history = historyForAI;
        }

        const response = await config.flow(flowInput);
        if (!response) throw new Error("Resposta Nula");
        
        const responseText = response.response || response.text || '';
        const systemMessageData = { ...response, response: responseText, emotion: 'normal' };
        
        const msgId = Date.now() + 1;
        addMessage('system', systemMessageData);

        if (response.nextConversationStage || response.nextStage) {
          if (activeContext === 'dante') setDanteStage(response.nextStage || response.nextConversationStage);
          else if (activeContext === 'djeny') setDjenyStage(response.nextConversationStage);
        }

        if (responseText) {
          playAudio({ text: responseText, voice: activeContext.startsWith('dante') ? 'dante' : 'djeny', id: msgId });
        }
    } catch (error: any) {
        addMessage('system', { response: `INSTABILIDADE DETECTADA: ${'${error.message}'}`, emotion: 'alert' });
    } finally {
        setIsLoading(false);
    }
  }, [input, user, activeContext, isAdmin, purchases, config, addMessage, stopAudio, playAudio, danteStage, djenyStage, contextData, messages]);

  const openChatWithContext = useCallback((context: AIContext, data?: any) => {
    if (!user) {
        setMessages([{ id: Date.now(), sender: 'system', data: { response: 'Acesso restrito. Crie sua conta para iniciar.', recommendedCourseSlug: '/login', emotion: 'alert' }, aiContext: context }]);
    } else if (!hasAccessToMentoria) {
        setMessages([{ id: Date.now(), sender: 'system', data: { response: 'Acesso restrito. Este Mentor de Elite será liberado após a sua primeira aula teórica e confirmação de acesso.', recommendedCourseSlug: '/courses', emotion: 'alert' }, aiContext: context }]);
    } else {
        if (context !== activeContext) {
          setMessages([]);
          setDanteStage('AVALIACAO');
          setDjenyStage('AVALIACAO');
        }
        setContextData(data || null);
    }
    setActiveContext(context);
    setIsOpen(true);
    stopAudio();
  }, [user, hasAccessToMentoria, activeContext, stopAudio]);

  useEffect(() => {
    const handleOpenChat = (event: any) => openChatWithContext(event.context, event.data);
    eventEmitter.on('open-chat', handleOpenChat);
    return () => eventEmitter.off('open-chat', handleOpenChat);
  }, [openChatWithContext]);

  if (isUserLoading) return null;

  return (
    <>
      {isOpen && (
        <div className={cn("fixed z-[200] flex flex-col shadow-2xl bg-background", isFullScreen ? "inset-0" : "bottom-5 right-5 w-full max-w-md h-[75vh] max-h-[700px] rounded-lg border")}>
          <div className="flex-shrink-0 relative h-48 bg-black flex items-center justify-center">
            <Image src={config.avatar === 'clan' ? placeholderImages.dante.src : config.avatar} alt="AI" fill sizes={isFullScreen ? '100vw' : '448px'} className="object-contain" />
            <div className="absolute top-3 right-3 flex gap-2">
              <span className="bg-black/50 text-white px-2 py-1 rounded text-xs">{Math.floor(callDuration/60)}:{(callDuration%60).toString().padStart(2,'0')}</span>
              <Button size="icon" variant="ghost" className="text-white" onClick={() => setIsFullScreen(!isFullScreen)}>{isFullScreen ? <Minimize /> : <Maximize />}</Button>
              <Button size="icon" variant="ghost" className="text-white" onClick={() => { stopAudio(); setIsOpen(false); }}><X /></Button>
            </div>
          </div>

          <CardHeader className="py-2 border-y flex-shrink-0">
            <CardTitle className="text-sm">{config.name}</CardTitle>
          </CardHeader>
          
          <div className="flex-1 min-h-0">
            <div className="h-full overflow-y-auto p-4">
              {messages.map(msg => {
              const recommendedSlug = (msg.data as any).recommendedCourseSlug;
              const textToPlay = (msg.data as any).response || (msg.data as any).text || '';
              const currentVoice = msg.aiContext.startsWith('dante') ? 'dante' : 'djeny';

              return (
                  <div key={msg.id} className={cn("mb-4 flex items-end gap-2", msg.sender === 'user' ? "justify-end" : "justify-start")}>
                  {msg.sender === 'system' && (
                      <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={config.avatar === 'clan' ? placeholderImages.contact.src : config.avatar} />
                      <AvatarFallback>{config.avatarFallback}</AvatarFallback>
                      </Avatar>
                  )}
                  <div className={cn("p-3 rounded-lg max-w-[80%] text-sm", msg.sender === 'user' ? "bg-primary text-white" : "bg-secondary")}>
                      {msg.imageUri && <Image src={msg.imageUri} alt="upload" width={100} height={100} className="mb-2 rounded" />}
                      <p>{textToPlay}</p>
                      {recommendedSlug && (
                      <div className="mt-2">
                          <Button asChild size="sm" variant={recommendedSlug === '/login' ? 'default' : 'outline'} className="border-accent text-accent hover:bg-accent/10 hover:text-accent">
                          <Link href={recommendedSlug}>
                              <BookOpen className="mr-2 h-4 w-4" />
                              {recommendedSlug === '/login' ? 'Fazer Login' : 'Ver Cursos'}
                          </Link>
                          </Button>
                      </div>
                      )}
                  </div>
                  {msg.sender === 'system' && textToPlay && (
                      <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 shrink-0 self-center text-muted-foreground hover:text-foreground"
                          onClick={() => {
                              if (playingId === msg.id) {
                                  stopAudio();
                              } else {
                                  playAudio({ text: textToPlay, voice: currentVoice, id: msg.id });
                              }
                          }}
                      >
                          {isLoadingAudio && playingId === msg.id ? <Loader2 className="h-4 w-4 animate-spin" /> : (isPlaying && playingId === msg.id ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />)}
                          <span className="sr-only">Ouvir áudio</span>
                      </Button>
                  )}
                  {msg.sender === 'user' && (
                      <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback><User/></AvatarFallback>
                      </Avatar>
                  )}
                  </div>
              )
              })}
              {isLoading && (
                  <div className="flex items-center gap-2 justify-start">
                      <div className="bg-secondary rounded-lg px-4 py-3 rounded-bl-none">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                      </div>
                  </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <CardFooter className="p-2 border-t flex flex-col gap-2 flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => handleSubmit(undefined, "Analise esta imagem", ev.target?.result as string);
                  reader.readAsDataURL(file);
                }
              }} />
              <Button type="button" size="icon" variant="ghost" onClick={() => fileInputRef.current?.click()}><CameraIcon className="h-4 w-4"/></Button>
              <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Mensagem..." className="min-h-[40px] resize-none" />
               <Button type="button" size="icon" variant={isRecording ? "destructive" : "ghost"} onClick={handleMicClick} disabled={isLoading || !recognitionRef.current}>
                <Mic className="h-4 w-4" />
              </Button>
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}><Send className="h-4 w-4"/></Button>
            </form>
            <p className="text-[10px] text-center text-muted-foreground">{disclaimerText}</p>
          </CardFooter>
        </div>
      )}
    </>
  );
}
