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
import { djenyChat } from '@/ai/flows/djeny-chat-flow';
import type { DjenyChatOutput, DjenyConversationStage } from '@/ai/flows/djeny-chat-types';
import placeholderImages from '@/lib/placeholder-images.json';
import Image from 'next/image';
import { useNexusAudio } from '@/hooks/use-nexus-audio';
import { useUser } from '@/auth';
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
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setDetailsVisible(true)}>
                {t('chat.button.pay')}
            </Button>
        );
    }

    return (
        <div className="space-y-3 text-left">
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
            <Card className="bg-secondary/20 border-accent/20">
                <CardHeader className="p-3">
                    <CardTitle className="text-base text-accent">{t('chat.payment.investment')}</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                    <p className="text-xl font-bold">{formattedPrice}</p>
                    <p className="text-xs text-muted-foreground">{course.title}</p>
                </CardContent>
            </Card>
            <Button className="w-full h-12 font-bold bg-primary hover:bg-primary/90" onClick={() => setShowQrModal(true)}>
                <ScanLine className="mr-2 h-5 w-5" />
                {t('chat.payment.qr_button')}
            </Button>
            <Button variant="secondary" className="w-full" onClick={handleCopyPayload}>
                {isPayloadCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {isPayloadCopied ? t('chat.payment.copied') : t('chat.payment.copy_button')}
            </Button>
             <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
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
  data: { text: string } | DjenyChatOutput;
}

const DjenyMessageContent = ({ msg, paymentCourse }: { msg: Message, paymentCourse: Course | null }) => {
    const { data, sender } = msg;

    if (sender === 'user') {
        const userData = data as { text: string };
        return <p className="whitespace-pre-wrap">{userData.text}</p>;
    }
    
    const responseData = data as DjenyChatOutput;
    const isCheckmateStage = responseData.nextConversationStage === 'XEQUE_MATE';
    
    return (
        <div className="space-y-3">
            <p className="whitespace-pre-wrap flex-1">{responseData.response}</p>
            {isCheckmateStage && paymentCourse && (
                <div className="mt-4 border-t border-dashed border-accent/30 pt-4">
                    <NewPaymentFlow course={paymentCourse} />
                </div>
            )}
        </div>
    );
};


export default function DjenyChat() {
  const { user } = useUser();
  const { t, locale } = useLocale();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // State for "Protocolo Anjo"
  const [conversationStage, setConversationStage] = useState<DjenyConversationStage>('AVALIACAO');
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
      const savedState = localStorage.getItem('djenyChatState');
      if (savedState) {
        const { stage: savedStage } = JSON.parse(savedState);
        if (savedStage) setConversationStage(savedStage);
      }
    } catch (error) {
      console.error("VIX DIAGNOSTIC: Failed to load Djeny Chat state from localStorage", error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      const stateToSave = { stage: conversationStage };
      localStorage.setItem('djenyChatState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error("VIX DIAGNOSTIC: Failed to save Djeny Chat state to localStorage", error);
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
      // Create a fake submit event to trigger handleSubmit
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
      const response: DjenyChatOutput = await djenyChat({
        userMessage: currentInput,
        userName: user.displayName || 'Anjo',
        locale: locale,
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

      const djenyMessage: Message = {
        id: Date.now() + 1,
        sender: 'system',
        data: response,
      };
      setMessages(prev => [...prev, djenyMessage]);

      if (response.response) {
        playAudio({ text: response.response, voice: 'djeny', id: djenyMessage.id });
      }

    } catch (error) {
      console.error("Error calling Djeny chat flow:", error);
      const errorText = t('common.error' as any) || "Detectei uma instabilidade em nossos sistemas. Sua mensagem é importante, mas no momento não consegui processá-la. Por favor, tente novamente em alguns instantes.";
      const errorMessageId = Date.now() + 1;
      const errorMessage: Message = {
        id: errorMessageId,
        sender: 'system',
        data: { response: errorText },
      };
      setMessages(prev => [...prev, errorMessage]);
      playAudio({ text: errorText, voice: 'djeny', id: errorMessageId });
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
    <Card className="h-[70vh] flex flex-col shadow-2xl border-accent/20 bg-background/80 overflow-hidden relative max-w-3xl mx-auto">
        <Image
          src="https://images.unsplash.com/photo-1544717305-27a734ef1904?q=80&w=1470&auto=format&fit=crop"
          alt="Djeny Intelligence Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
          className="absolute inset-0 z-0 opacity-10"
        />
        <div className="absolute inset-0 bg-background/80 z-0" />
      <div className="relative z-10 flex flex-col h-full">
        <CardHeader className="flex flex-row items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-accent">
            <AvatarImage src={placeholderImages.contact.src} alt={placeholderImages.contact.alt} />
            <AvatarFallback className="bg-accent text-accent-foreground font-bold">D</AvatarFallback>
            </Avatar>
            <div>
            <CardTitle className="font-headline text-lg">{t('intelligence.djeny.title')}</CardTitle>
            <CardDescription>{t('intelligence.djeny.description')}</CardDescription>
            </div>
            <div className="flex-1" />
            <Button variant="ghost" size="icon" onClick={stopAudio} disabled={!isPlaying && !isLoadingAudio}>
              {isLoadingAudio ? <Loader2 className="h-4 w-4 animate-spin" /> : isPlaying ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4 opacity-50" />}
            </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 relative min-h-0">
            <ScrollArea className="flex-1 w-full">
            <div className="p-4 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={cn("flex items-end gap-2", msg.sender === 'user' ? "justify-end" : "justify-start")}>
                        {msg.sender === 'system' && (
                        <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarImage src={placeholderImages.contact.src} alt={placeholderImages.contact.alt} />
                            <AvatarFallback>D</AvatarFallback>
                        </Avatar>
                        )}
                        <div className={cn("max-w-[85%] rounded-lg px-4 py-2 text-sm", msg.sender === 'user' ? "bg-primary text-primary-foreground rounded-br-none" : "bg-secondary text-secondary-foreground rounded-bl-none")}>
                           <DjenyMessageContent msg={msg} paymentCourse={paymentCourse} />
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
                    <div className="bg-secondary rounded-lg px-4 py-3 rounded-bl-none">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <div className="flex w-full flex-col gap-2">
            <form onSubmit={(e) => handleSubmit(e)} className="flex w-full items-start gap-2">
              <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('chat.placeholder.scenario')}
                  autoComplete="off"
                  disabled={isLoading || conversationStage === 'XEQUE_MATE'}
                  rows={1}
                  className="max-h-40 min-h-10 resize-none bg-background/50 border-gray-600 text-gray-200 placeholder:text-gray-500 focus:border-accent"
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim() || conversationStage === 'XEQUE_MATE'} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Send className="w-5 h-5" />
                  <span className="sr-only">Enviar</span>
              </Button>
              <Button type="button" size="icon" variant={isRecording ? "destructive" : "outline"} onClick={handleMicClick} disabled={isLoading || !recognitionRef.current || conversationStage === 'XEQUE_MATE'} className={cn(!isRecording && "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white")}>
                  <Mic className="w-5 h-5" />
                  <span className="sr-only">Gravar Voz</span>
              </Button>
            </form>
            <p className="w-full pt-1 text-center text-xs text-muted-foreground">{t('chat.footer.disclaimer', { name: 'Djeny' })}</p>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
