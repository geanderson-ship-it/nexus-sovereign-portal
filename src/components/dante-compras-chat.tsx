'use client';

import { useState, useRef, useEffect, FormEvent, KeyboardEvent, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, User, Loader2, Mic, Pause, Volume2, X, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { danteComprasChat } from '@/ai/flows/dante-compras-chat-flow';
import type { DanteComprasChatOutput } from '@/ai/flows/dante-compras-chat-types';
import placeholderImages from '@/lib/placeholder-images.json';
import { useNexusAudio } from '@/hooks/use-nexus-audio';
import type { QuotationAnalysisOutput } from '@/ai/flows/dante-quotation-types';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';

type Sender = 'user' | 'system';

interface Message {
  id: number;
  sender: Sender;
  data: DanteComprasChatOutput | { text: string };
}

const MessageContent = ({ msg }: { msg: Message }) => {
    const { sender, data } = msg;

    if (sender === 'user') {
        const userData = data as { text: string };
        return <p className="whitespace-pre-wrap">{userData.text}</p>;
    }

    const responseData = data as DanteComprasChatOutput;
    return <p className="whitespace-pre-wrap flex-1">{responseData.response}</p>;
};

export default function DanteComprasChat({ quotationAnalysis, onClose, isEmbedded = false }: { quotationAnalysis: QuotationAnalysisOutput | null; onClose?: () => void; isEmbedded?: boolean }) {
  const { user } = useUser();
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { playAudio, stopAudio, isPlaying, isLoadingAudio, playingId } = useNexusAudio();
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const userInitials = useMemo(() => {
    if (!user?.displayName) return 'U';
    const names = user.displayName.split(' ');
    const initials = names.map((n) => n[0]).join('');
    return initials.slice(0, 2).toUpperCase();
  }, [user]);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      const initialMessage: Message = {
        id: Date.now(),
        sender: 'system',
        data: {
          response: quotationAnalysis
            ? `Análise da cotação carregada. Estou pronto para discutir a estratégia de negociação.`
            : `Central de Suprimentos ativa. Sou Dante, sua IA de negociação. Apresente o cenário da cotação ou o desafio de compra. Serei direto e analítico.`,
        },
      };
      setMessages([initialMessage]);
      playAudio({
        text: (initialMessage.data as any).response || (initialMessage.data as any).text || "",
        voice: 'dante',
        id: initialMessage.id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotationAnalysis]);

  // Speech Recognition Setup
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'pt-BR';
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((r) => r[0]).map((r) => r.transcript).join('');
      setInput(transcript);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (event) => {
      console.error('Erro no reconhecimento de voz:', event.error);
      setIsRecording(false);
    };
    recognitionRef.current = recognition;
  }, []);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    stopAudio();
    const userMessage: Message = { id: Date.now(), sender: 'user', data: { text: input } };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await danteComprasChat({ 
        userMessage: currentInput,
        quotationAnalysis: quotationAnalysis ?? undefined
      });
      const danteMessage: Message = { id: Date.now() + 1, sender: 'system', data: response };
      setMessages((prev) => [...prev, danteMessage]);
      if (response.response) {
        playAudio({ text: response.response, voice: 'dante', id: danteMessage.id });
      }
    } catch (error) {
      console.error('Error calling Dante Compras chat flow:', error);
      const errorText = 'FALHA DE PROTOCOLO. A central de suprimentos está instável. Tente novamente.';
      const errorMessageId = Date.now() + 1;
      const errorMessage: Message = { id: errorMessageId, sender: 'system', data: { response: errorText } };
      setMessages((prev) => [...prev, errorMessage]);
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

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  }

  return (
    <Card className={cn(
        "w-full max-w-3xl flex flex-col shadow-2xl border-blue-800/60 bg-gray-900/50 overflow-hidden relative backdrop-blur-sm",
        isEmbedded ? "h-[70vh]" : "h-full",
        isMaximized && !isEmbedded && "fixed inset-0 z-50 max-w-full h-full rounded-none"
    )}>
      <div className="relative z-10 flex flex-col h-full text-white">
        <CardHeader className="flex flex-row items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-gray-500">
                <AvatarImage src={placeholderImages.dante.src} alt={placeholderImages.dante.alt} />
                <AvatarFallback className="bg-gray-600 text-white font-bold">D</AvatarFallback>
            </Avatar>
            <div>
            <CardTitle className="font-headline text-lg text-blue-300">Dante Compras (O Negociador).</CardTitle>
            <CardDescription className="text-gray-400">Análise. Estratégia. Lucro.</CardDescription>
            </div>
            <div className="flex-1" />
            <Button variant="ghost" size="icon" onClick={stopAudio} disabled={!isPlaying && !isLoadingAudio}>
              {isLoadingAudio ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isPlaying ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4 opacity-50" />}
            </Button>
            {!isEmbedded && (
                <>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={() => setIsMaximized(!isMaximized)}>
                    {isMaximized ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
                {onClose && (
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={handleClose}>
                        <X className="h-4 w-4" />
                    </Button>
                )}
                </>
            )}
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
                            <MessageContent msg={msg} />
                        </div>
                         {msg.sender === 'system' && (
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 shrink-0 text-gray-400 hover:text-white"
                                onClick={() => {
                                    const textToPlay = ('response' in msg.data) ? msg.data.response : ('text'in msg.data ? msg.data.text : '');
                                    if (playingId === msg.id) {
                                        stopAudio();
                                    } else if (textToPlay) {
                                        playAudio({ text: textToPlay, voice: 'dante', id: msg.id });
                                    }
                                }}
                            >
                                {isLoadingAudio && playingId === msg.id ? <Loader2 className="h-4 w-4 animate-spin" /> : (isPlaying && playingId === msg.id ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />)}
                                <span className="sr-only">Ouvir áudio</span>
                            </Button>
                        )}
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
            <form onSubmit={handleSubmit} className="flex w-full items-start gap-2">
              <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Apresente o cenário de compra..."
                  autoComplete="off"
                  disabled={isLoading}
                  rows={1}
                  className="max-h-40 min-h-10 resize-none bg-black/40 border-gray-600 text-gray-200 placeholder:text-gray-500 focus:border-blue-500"
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="bg-blue-600 hover:bg-blue-500 text-white">
                  <Send className="w-5 h-5" />
                  <span className="sr-only">Enviar</span>
              </Button>
              <Button type="button" size="icon" variant={isRecording ? "destructive" : "outline"} onClick={handleMicClick} disabled={isLoading || !recognitionRef.current} className={cn(!isRecording && "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white")}>
                  <Mic className="w-5 h-5" />
                  <span className="sr-only">Gravar Voz</span>
              </Button>
            </form>
            <p className="w-full pt-1 text-center text-xs text-gray-500">O Dante é uma IA e pode cometer erros. Confira as respostas. Devido ao alto fluxo, o áudio pode demorar alguns instantes.</p>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
