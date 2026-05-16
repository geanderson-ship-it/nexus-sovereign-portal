
'use client';

import { useState, useRef, useEffect, FormEvent, KeyboardEvent, useMemo } from 'react';
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
import { Send, User, Loader2, BookOpen, Mic, Pause, Volume2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { careerChat } from '@/ai/flows/career-chat-flow';
import type { CareerChatOutput } from '@/ai/flows/career-chat-types';
import placeholderImages from '@/lib/placeholder-images.json';
import Link from 'next/link';
import Image from 'next/image';
import { useNexusAudio } from '@/hooks/use-nexus-audio';
import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';


type Sender = 'user' | 'system';

interface Purchase {
  id: string;
  courseId: string;
}

interface Message {
  id: number;
  sender: Sender;
  data: CareerChatOutput | { text: string };
}

const aiConfig = {
  career: {
    name: 'Djeny (Sua Estrategista)',
    description: 'Mentora de Carreira e Inteligência Emocional',
    avatar: placeholderImages.contact.src,
    avatarAlt: placeholderImages.contact.alt,
    avatarFallback: 'D',
  },
};

const MessageContent = ({ msg }: { msg: Message }) => {
    const { sender, data } = msg;

    if (sender === 'user') {
        const userData = data as { text: string };
        return <p className="whitespace-pre-wrap">{userData.text}</p>;
    }

    const responseData = data as CareerChatOutput;
    const courseSlug = responseData.recommendedCourseSlug;
    const textToPlay = responseData.response;

    return (
        <div className="space-y-3 text-sm">
            <p className="whitespace-pre-wrap flex-1">{textToPlay}</p>
            {courseSlug && (
                <div className="pt-2">
                    <Button asChild size="sm" variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent">
                        <Link href={`/courses/${courseSlug}`}>
                            <BookOpen className="mr-2 h-4 w-4" />
                            Ver Curso Recomendado
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
};


export function CareerAdvisorChat() {
  const { user, isUserLoading } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const userInitials = useMemo(() => {
    if (!user?.displayName) return 'U';
    const names = user.displayName.split(' ');
    const initials = names.map((n) => n[0]).join('');
    return initials.slice(0, 2).toUpperCase();
  }, [user]);

  const isAdmin = useMemo(() => isAdminUser(user), [user]);
  const hasAccessToMentoria = useMemo(() => isAdmin || !!user, [isAdmin, user]);


  // Audio and Speech Recognition State
  const { playAudio, stopAudio, isPlaying, isLoadingAudio, playingId } = useNexusAudio();
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

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
    recognition.lang = 'pt-BR';
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
  }, []);

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
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response: CareerChatOutput = await careerChat({ userMessage: input });
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
      console.error("Error calling career chat flow:", error);
      const errorText = "Detectei uma instabilidade em nossos sistemas. Sua mensagem é importante, mas no momento não consegui processá-la. Por favor, tente novamente em alguns instantes.";
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
  
  if (isUserLoading) {
    return (
      <Card className="h-[70vh] flex flex-col items-center justify-center shadow-2xl border-accent/20 bg-background/80">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </Card>
    );
  }

  if (!user || !hasAccessToMentoria) {
    return (
      <Card className="text-center max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Users className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl">
            Acesso à Mentoria de Carreira
          </CardTitle>
          <CardDescription>
            A mentoria com a Djeny é um benefício exclusivo para membros que possuem pelo menos um curso com Acesso Total.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Para desbloquear este e outros terminais de IA, adquira um de nossos cursos de elite.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/courses">
              <BookOpen className="mr-2 h-4 w-4" />
              Ver Cursos e Desbloquear Acesso
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="h-[70vh] flex flex-col shadow-2xl border-accent/20 bg-background/80 overflow-hidden relative max-w-3xl mx-auto">
        <Image
          src="/images/nexus-chat-background.png"
          alt="Dante e Djeny, os mentores de IA da Nexus"
          fill
          style={{ objectFit: 'cover' }}
          priority
          className="absolute inset-0 z-0 opacity-10"
        />
        <div className="absolute inset-0 bg-background/80 z-0" />
      <div className="relative z-10 flex flex-col h-full">
        <CardHeader className="flex flex-row items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-accent">
            <AvatarImage src={aiConfig.career.avatar} alt={aiConfig.career.avatarAlt} />
            <AvatarFallback className="bg-accent text-accent-foreground font-bold">{aiConfig.career.avatarFallback}</AvatarFallback>
            </Avatar>
            <div>
            <CardTitle className="font-headline text-lg">{aiConfig.career.name}</CardTitle>
            <CardDescription>{aiConfig.career.description}</CardDescription>
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
                        <MessageContent msg={msg} />
                    </div>
                    {msg.sender === 'user' && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={user?.photoURL ?? undefined} alt={user?.displayName ?? 'Avatar'} />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                    )}
                </div>
                ))}
                {isLoading && messages[messages.length -1]?.sender === 'user' && (
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
            <form onSubmit={handleSubmit} className="flex w-full items-start gap-2">
              <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Qual o seu próximo movimento estratégico?"
                  autoComplete="off"
                  disabled={isLoading}
                  rows={1}
                  className="max-h-40 min-h-10 resize-none"
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  <Send className="w-5 h-5" />
                  <span className="sr-only">Enviar</span>
              </Button>
              <Button type="button" size="icon" variant={isRecording ? "destructive" : "outline"} onClick={handleMicClick} disabled={isLoading || !recognitionRef.current}>
                  <Mic className="w-5 h-5" />
                  <span className="sr-only">Gravar Voz</span>
              </Button>
            </form>
            <p className="w-full pt-1 text-center text-xs text-muted-foreground">A Djeny é uma IA e pode cometer erros. Confira as respostas. Devido ao alto fluxo, o áudio pode demorar alguns instantes.</p>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
