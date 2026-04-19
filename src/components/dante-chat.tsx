'use client';

import { useState, useRef, useEffect, FormEvent, KeyboardEvent, useMemo } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, User, Loader2, Mic, Pause, Volume2, MessageSquare, Copy, Check, ScanLine } from 'lucide-react';
import { cn, generatePixPayload } from '@/lib/utils';
import { danteChat } from '@/ai/flows/dante-chat-flow';
import type { DanteChatOutput, DanteConversationStage } from '@/ai/flows/dante-chat-types';
import placeholderImages from '@/lib/placeholder-images.json';
import { useUser } from '@/firebase';
import Image from 'next/image';
import { useNexusAudio } from '@/hooks/use-nexus-audio';
import { getCourseBySlug, type Course } from '@/lib/courses-data';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const QrCode = dynamic(() => import('@/components/ui/qr-code').then(mod => mod.QrCode), {
  ssr: false,
  loading: () => <Skeleton className="w-[64px] h-[64px] rounded-lg" />,
});


// =============================================
// Internal Components for Payment Flow
// =============================================
const NewPaymentFlow = ({ course }: { course: Course }) => {
    const { t, locale } = useLocale();
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);
    const [isPayloadCopied, setIsPayloadCopied] = useState(false);
    const { toast } = useToast();
    const WHATSAPP_NUMBER = '5551999799582';
    
    const formattedPrice = useMemo(() => new Intl.NumberFormat(locale === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale === 'pt-BR' ? 'BRL' : 'USD' }).format(course.discountedPrice), [course.discountedPrice, locale]);
    const whatsappMessage = t('whatsapp.payment.message', { price: formattedPrice, title: course.title });
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

    const pixPayload = useMemo(() => {
        return generatePixPayload({
            amount: course.discountedPrice,
            txid: 'NEXUS2026',
        });
    }, [course]);

    const handleCopyPayload = () => {
      navigator.clipboard.writeText(pixPayload);
      setIsPayloadCopied(true);
      toast({ title: t('chat.payment.copied') });
      setTimeout(() => setIsPayloadCopied(false), 2000);
    }

    if (!detailsVisible) {
        return (
            <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white" onClick={() => setDetailsVisible(true)}>
                {t('chat.button.pay')}
            </Button>
        );
    }

    return (
        <div className="space-y-3 text-left text-white">
            <Dialog open={showQrModal} onOpenChange={setShowQrModal}>
                <DialogContent className="bg-white p-4 max-w-xs">
                    <DialogHeader>
                        <DialogTitle className="text-center text-black">{t('chat.payment.title')}</DialogTitle>
                        <DialogDescription className="text-center">{t('chat.payment.qr_desc')}</DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center p-4">
                        <QrCode value={pixPayload} size={256} />
                    </div>
                     <p className="text-center text-black font-bold">{t('contact.mailto.amount' as any) || (locale === 'pt-BR' ? 'Valor' : 'Amount')}: {formattedPrice}</p>
                </DialogContent>
            </Dialog>
             <Card className="bg-gray-800/70 border-gray-700">
                <CardHeader className="p-3">
                    <CardTitle className="text-base text-blue-300">{t('chat.payment.investment')}</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                    <p className="text-xl font-bold">{formattedPrice}</p>
                    <p className="text-xs text-gray-400">{course.title}</p>
                </CardContent>
            </Card>
            <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white h-12" onClick={() => setShowQrModal(true)}>
                <ScanLine className="mr-2 h-5 w-5" />
                {t('chat.payment.qr_button')}
            </Button>
            <Button variant="secondary" className="w-full" onClick={handleCopyPayload}>
                {isPayloadCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {isPayloadCopied ? t('chat.payment.copied') : t('chat.payment.copy_button')}
            </Button>
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {t('chat.payment.whatsapp_button')}
                </a>
            </Button>
        </div>
    );
};


// =============================================
// Main Chat Component
// =============================================
type Sender = 'user' | 'system';

interface Message {
  id: number;
  sender: Sender;
  data: { text: string } | DanteChatOutput;
}

const DanteMessageContent = ({ msg, paymentCourse }: { msg: Message, paymentCourse: Course | null }) => {
    const { data, sender } = msg;

    if (sender === 'user') {
        const userData = data as { text: string };
        return <p className="whitespace-pre-wrap">{userData.text}</p>;
    }

    const responseData = data as DanteChatOutput;
    const isVereditoStage = responseData.nextConversationStage === 'VEREDITO';

    return (
        <div className="space-y-3">
            <p className="whitespace-pre-wrap flex-1">{responseData.text}</p>
            {isVereditoStage && paymentCourse && (
                <div className="mt-4 border-t border-dashed border-blue-800/60 pt-4">
                    <NewPaymentFlow course={paymentCourse} />
                </div>
            )}
        </div>
    );
};


export default function DanteChat() {
  const { t, locale } = useLocale();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // State for "Protocolo Convocação do Safra"
  const [conversationStage, setConversationStage] = useState<DanteConversationStage>('AVALIACAO');
  const [paymentCourse, setPaymentCourse] = useState<Course | null>(null);


  // Audio and Speech Recognition State
  const { playAudio, stopAudio, isPlaying, isLoadingAudio, playingId } = useNexusAudio();
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const userInitials = useMemo(() => {
    if (!user?.displayName) return 'U';
    const names = user.displayName.split(' ');
    const initials = names.map((n) => n[0]).join('');
    return initials.slice(0, 2).toUpperCase();
  }, [user]);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('danteChatState');
      if (savedState) {
        const { stage: savedStage } = JSON.parse(savedState);
        if (savedStage) setConversationStage(savedStage);
      }
    } catch (error) {
      console.error("VIX DIAGNOSTIC: Failed to load Dante Chat state from localStorage", error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      const stateToSave = { stage: conversationStage };
      localStorage.setItem('danteChatState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error("VIX DIAGNOSTIC: Failed to save Dante Chat state to localStorage", error);
    }
  }, [conversationStage]);


  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Speech Recognition Setup
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition não é suportado neste navegador.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = locale;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map(r => r[0]).map(r => r.transcript).join('');
      setInput(transcript);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (event) => {
      console.error('Erro no reconhecimento de voz:', event.error);
      setIsRecording(false);
    };
    recognitionRef.current = recognition;
  }, [locale]);
  
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }, [messages]);

  // Automatically send first message if in AVALIACAO stage
  useEffect(() => {
    if (messages.length === 0 && conversationStage === 'AVALIACAO' && !isLoading) {
      const fakeEvent = { preventDefault: () => {} } as FormEvent;
      handleSubmit(fakeEvent, "Olá");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationStage]);

  const handleSubmit = async (e: FormEvent, programmaticInput?: string) => {
    e.preventDefault();
    const currentInput = programmaticInput || input;
    if (!currentInput.trim() || isLoading || !user) return;
    
    stopAudio();

    const userMessage: Message = { id: Date.now(), sender: 'user', data: { text: currentInput } };
    setMessages(prev => [...prev, userMessage]);
    if(!programmaticInput) setInput('');
    setIsLoading(true);

    try {
      const response: DanteChatOutput = await danteChat({ 
        userMessage: currentInput,
        userName: user.displayName || 'Comandante',
        conversationStage: conversationStage,
      });

      if (response.nextConversationStage) {
        setConversationStage(response.nextConversationStage);
      }
      if (response.recommendedCourseSlug) {
        const course = getCourseBySlug(response.recommendedCourseSlug);
        if (course) {
            setPaymentCourse(course);
        }
      }

      const danteMessage: Message = {
        id: Date.now() + 1,
        sender: 'system',
        data: response,
      };
      setMessages(prev => [...prev, danteMessage]);
      if (response.text) {
        playAudio({ text: response.text, voice: 'dante', id: danteMessage.id });
      }
    } catch (error: any) {
      console.error("Error calling dante chat flow:", error);
      const errorText = t('common.error' as any) || "FALHA DE PROTOCOLO NO SERVIDOR. O Guardião pode estar instável. Tente novamente.";
      const errorMessageId = Date.now() + 1;
      
      const errorData: DanteChatOutput = { text: errorText };
      const errorMessage: Message = {
        id: errorMessageId,
        sender: 'system',
        data: errorData,
      };
      setMessages(prev => [...prev, errorMessage]);
      playAudio({ text: errorText, voice: 'dante', id: errorMessageId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (event.currentTarget.form) {
        event.currentTarget.form.requestSubmit();
      }
    }
  };

  const handleMicClick = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (isRecording) {
      recognition.stop();
    } else {
      stopAudio();
      setInput('');
      recognition.start();
      setIsRecording(true);
    }
  };

  return (
    <Card className="h-[70vh] w-full max-w-3xl flex flex-col shadow-2xl border-blue-800/60 bg-gray-900/50 overflow-hidden relative backdrop-blur-sm">
        <Image
          src="https://images.unsplash.com/photo-1617575474138-344456a3e592?q=80&w=1470&auto=format&fit=crop"
          alt="Nexus Intelligence Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
          className="absolute inset-0 z-0 opacity-10"
        />
        <div className="absolute inset-0 bg-black/80 z-0" />
      <div className="relative z-10 flex flex-col h-full text-white">
        <CardHeader className="flex flex-row items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-gray-500">
                <AvatarImage src={placeholderImages.dante.src} alt={placeholderImages.dante.alt} />
                <AvatarFallback className="bg-gray-600 text-white font-bold">D</AvatarFallback>
            </Avatar>
            <div>
            <CardTitle className="font-headline text-lg text-blue-300">Dante (O Guardião)</CardTitle>
            <CardDescription className="text-gray-400">Lógica. Dados. Decisão.</CardDescription>
            </div>
            <div className="flex-1" />
            <Button variant="ghost" size="icon" onClick={stopAudio} disabled={!isPlaying && !isLoadingAudio}>
              {isLoadingAudio ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isPlaying ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4 opacity-50" />}
            </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 relative min-h-0">
            <ScrollArea className="flex-1 w-full">
            <div className="p-4 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={cn("flex items-end gap-2", msg.sender === 'user' ? "justify-end" : "justify-start")}>
                        {msg.sender === 'system' && (
                        <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarImage src={placeholderImages.dante.src} alt={placeholderImages.dante.alt} />
                            <AvatarFallback>D</AvatarFallback>
                        </Avatar>
                        )}
                        <div className={cn("max-w-[85%] rounded-lg px-4 py-2 text-sm", msg.sender === 'user' ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-700/80 text-gray-200 rounded-bl-none")}>
                            <DanteMessageContent msg={msg} paymentCourse={paymentCourse} />
                        </div>
                        {msg.sender === 'user' && (
                        <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarImage src={user?.photoURL ?? undefined} alt={user?.displayName ?? 'Avatar'} />
                            <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                        )}
                    </div>
                ))}
                {isLoading && messages.length > 0 && messages[messages.length -1]?.sender === 'user' && (
                <div className="flex items-center gap-2 justify-start">
                    <Avatar className="w-8 h-8">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </Avatar>
                    <div className="bg-gray-700/80 rounded-lg px-4 py-3 rounded-bl-none">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 border-t border-blue-800/60">
          <div className="flex w-full flex-col gap-2">
            <form onSubmit={(e) => handleSubmit(e)} className="flex w-full items-start gap-2">
              <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('chat.placeholder.scenario')}
                  autoComplete="off"
                  disabled={isLoading || conversationStage === 'VEREDITO'}
                  rows={1}
                  className="max-h-40 min-h-10 resize-none bg-black/40 border-gray-600 text-gray-200 placeholder:text-gray-500 focus:border-blue-500"
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim() || conversationStage === 'VEREDITO'} className="bg-blue-600 hover:bg-blue-500 text-white">
                  <Send className="w-5 h-5" />
                  <span className="sr-only">Enviar</span>
              </Button>
              <Button type="button" size="icon" variant={isRecording ? "destructive" : "outline"} onClick={handleMicClick} disabled={isLoading || !recognitionRef.current || conversationStage === 'VEREDITO'} className={cn(!isRecording && "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white")}>
                  <Mic className="w-5 h-5" />
                  <span className="sr-only">Gravar Voz</span>
              </Button>
            </form>
            <p className="w-full pt-1 text-center text-xs text-gray-500">{t('chat.footer.disclaimer', { name: 'Dante' })}</p>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
