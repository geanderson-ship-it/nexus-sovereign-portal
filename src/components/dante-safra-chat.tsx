'use client';

import { useState, useRef, useEffect, FormEvent, KeyboardEvent, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, User, Loader2, Wheat, Mic, Pause, Volume2, Camera as CameraIcon, X, Maximize, Minimize, ThermometerSun, DollarSign, Sprout, Beef, PiggyBank, Crown, Zap, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { danteSafra } from '@/ai/flows/dante-safra-flow';
import { IAPaymentModal } from './maga/ia-payment-modal';
import type { DanteSafraOutput, DanteSafraInput, PropertyDetails, DanteConversationStage } from '@/ai/flows/dante-safra-types';
import placeholderImages from '@/lib/placeholder-images.json';
import { useUser } from '@/auth';
import { useNexusAudio } from '@/hooks/use-nexus-audio';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { FeedbackDialog } from '@/components/feedback-dialog';
import { useLocale } from '@/hooks/use-locale';



type Sender = 'user' | 'system';

interface Message {
  id: number;
  sender: Sender;
  data: { text: string } | DanteSafraOutput;
  imageUri?: string;
}

const DanteSafraDashboard = ({ onMenuClick }: { onMenuClick: (prompt: string) => void }) => {
    const { t } = useLocale();
    const [searchQuery, setSearchQuery] = useState('');

    const ALL_CROPS = useMemo(() => [
      { id: 'soja', name: 'Protocolo Soja Ouro Verde (Alto Rendimento)', searchKeywords: ['soja', 'soybean', 'soy'] },
      { id: 'milho', name: 'Protocolo Milho Imperial (Alta Performance)', searchKeywords: ['milho', 'corn', 'maiz'] },
      { id: 'fumo', name: 'Protocolo Tabaco Folha de Ouro (Cura Especial)', searchKeywords: ['fumo', 'tabaco', 'smoke'] },
      { id: 'feijao', name: 'Protocolo Feijão Nobre (Nutrição de Precisão)', searchKeywords: ['feijao', 'feijão', 'beans'] },
      { id: 'canola', name: 'Protocolo Canola Dourada (Manejo de Inverno)', searchKeywords: ['canola', 'colza'] },
      { id: 'nozes', name: 'Cultura de Nozes Pecã (Pomar de Precisão)', searchKeywords: ['nozes', 'noz', 'pecã', 'walnuts'] },
      { id: 'aipim', name: 'Protocolo Aipim Raiz Forte (Rendimento de Solo)', searchKeywords: ['aipim', 'mandioca', 'aipin', 'cassava'] },
      { id: 'maca', name: 'Operação Pomar de Maçã (Fisiologia & Clima)', searchKeywords: ['maca', 'maçã', 'apple'] },
      { id: 'pessego', name: 'Pomar de Pêssego Nobre (Manejo Fitossanitário)', searchKeywords: ['pessego', 'pêssego', 'peach'] },
      { id: 'uva', name: 'Protocolo Viticultura (Videiras de Alta Performance)', searchKeywords: ['uva', 'parreira', 'vinho', 'grapes'] },
      { id: 'trigo', name: 'Protocolo Trigo de Inverno (Panificação Superior)', searchKeywords: ['trigo', 'wheat'] },
      { id: 'arroz', name: 'Cultura de Arroz Irrigado (Manejo de Várzea)', searchKeywords: ['arroz', 'rice'] },
    ], []);

    const ALL_LIVESTOCK = useMemo(() => [
      { id: 'corte', name: 'Operação Pecuária de Corte (Angus & Nelore de Elite)', searchKeywords: ['corte', 'boi', 'novilho', 'angus', 'nelore', 'carne'] },
      { id: 'leiteiro', name: 'Bovinocultura de Leite (Lactação de Alta Eficiência)', searchKeywords: ['leite', 'leiteiro', 'vaca', 'holandesa', 'jersey', 'girolando'] },
      { id: 'suinos', name: 'Suinocultura de Climatização Avançada', searchKeywords: ['suino', 'suíno', 'porco', 'leitão'] },
      { id: 'aves', name: 'Avicultura de Clima Controlado e Alta Precisão', searchKeywords: ['ave', 'aves', 'frango', 'galinha', 'aviário'] },
      { id: 'ovinos', name: 'Ovinocultura de Alta Performance (Genética de Ponta)', searchKeywords: ['ovino', 'ovinos', 'ovelha', 'carneiro', 'lã'] },
    ], []);

    const filteredCrops = useMemo(() => {
        if (!searchQuery.trim()) {
            return ALL_CROPS.slice(0, 8); // soja, milho, fumo, feijão, canola, nozes, aipim, maçã
        }
        const query = searchQuery.toLowerCase().trim();
        return ALL_CROPS.filter(crop => 
            crop.name.toLowerCase().includes(query) || 
            crop.searchKeywords.some(kw => kw.includes(query))
        );
    }, [searchQuery, ALL_CROPS]);

    const filteredLivestock = useMemo(() => {
        if (!searchQuery.trim()) {
            return ALL_LIVESTOCK;
        }
        const query = searchQuery.toLowerCase().trim();
        return ALL_LIVESTOCK.filter(livestock => 
            livestock.name.toLowerCase().includes(query) || 
            livestock.searchKeywords.some(kw => kw.includes(query))
        );
    }, [searchQuery, ALL_LIVESTOCK]);

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            const matchedCrop = ALL_CROPS.find(crop => 
                crop.name.toLowerCase().includes(query) || 
                crop.searchKeywords.some(kw => kw === query)
            );
            const matchedLivestock = ALL_LIVESTOCK.find(l => 
                l.name.toLowerCase().includes(query) || 
                l.searchKeywords.some(kw => kw === query)
            );

            if (matchedCrop) {
                onMenuClick(`Analisar ${matchedCrop.name}`);
            } else if (matchedLivestock) {
                onMenuClick(`Analisar ${matchedLivestock.name}`);
            } else {
                onMenuClick(`Analisar Protocolo para ${searchQuery}`);
            }
        }
    };

    return (
        <div className="p-4 space-y-4">
            {/* Imposing Glowing Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2 bg-black/40 p-2 rounded-lg border border-emerald-700/40 shadow-inner relative z-20">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-emerald-500/70" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Pesquise cultivos ou pecuária do Sul (canola, uva, aipim, nozes)..."
                        className="w-full bg-black/50 border border-gray-700 rounded-md pl-9 pr-4 py-2 text-xs text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                </div>
                <Button type="submit" size="sm" className="bg-emerald-700 hover:bg-emerald-600 text-xs px-4">
                    Consultar Dante
                </Button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Plantio Card */}
                <Card className="border-emerald-700/30 bg-gray-900/40">
                    <CardHeader className="p-3">
                        <CardTitle className="flex items-center gap-2 text-emerald-400 text-sm font-headline">
                            <Sprout className="h-4 w-4" />
                            Dante Safra — Divisão de Plantio
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                        {filteredCrops.length > 0 ? (
                            <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-emerald-800">
                                {filteredCrops.map(crop => (
                                    <Button 
                                        key={crop.id} 
                                        variant="outline" 
                                        size="sm" 
                                        className="justify-start border-gray-800 bg-gray-900/60 hover:bg-emerald-950/20 hover:border-emerald-800 text-gray-300 text-[11px] h-8 px-3 font-medium transition-all"
                                        onClick={() => onMenuClick(`Analisar ${crop.name}`)}
                                    >
                                        {crop.name}
                                    </Button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-500 text-xs">Nenhum cultivo encontrado para "{searchQuery}".</p>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="mt-2 text-xs border-emerald-800 text-emerald-400 hover:bg-emerald-950/20"
                                    onClick={() => onMenuClick(`Analisar Protocolo para ${searchQuery}`)}
                                >
                                    Solicitar Análise de "{searchQuery}"
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pecuária Card */}
                <Card className="border-emerald-700/30 bg-gray-900/40">
                    <CardHeader className="p-3">
                        <CardTitle className="flex items-center gap-2 text-emerald-400 text-sm font-headline">
                            <Beef className="h-4 w-4" />
                            Dante Safra — Divisão de Pecuária
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                        {filteredLivestock.length > 0 ? (
                            <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto pr-1">
                                {filteredLivestock.map(l => (
                                    <Button 
                                        key={l.id} 
                                        variant="outline" 
                                        size="sm" 
                                        className="justify-start border-gray-800 bg-gray-900/60 hover:bg-emerald-950/20 hover:border-emerald-800 text-gray-300 text-[11px] h-8 px-3 font-medium transition-all"
                                        onClick={() => onMenuClick(`Analisar ${l.name}`)}
                                    >
                                        {l.name}
                                    </Button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-500 text-xs">Nenhum sistema pecuário encontrado.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Clima e Solo Card */}
                <Card className="border-emerald-700/30 bg-gray-900/40">
                    <CardHeader className="p-3">
                        <CardTitle className="flex items-center gap-2 text-emerald-400 text-sm font-headline">
                            <ThermometerSun className="h-4 w-4" />
                            Dante Safra — Clima e Solo
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                        <Button className="w-full bg-emerald-800/40 hover:bg-emerald-700/60 border border-emerald-700/30 text-emerald-300 text-xs h-8" onClick={() => onMenuClick("Gerar Relatório de Clima e Qualidade do Solo")}>
                            {t('intelligence.dante-safra.dashboard.access')}
                        </Button>
                    </CardContent>
                </Card>

                {/* Mercado e Preços Card */}
                <Card className="border-emerald-700/30 bg-gray-900/40">
                    <CardHeader className="p-3">
                        <CardTitle className="flex items-center gap-2 text-emerald-400 text-sm font-headline">
                            <DollarSign className="h-4 w-4" />
                            Dante Safra — Mercado e Preços
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                        <Button className="w-full bg-emerald-800/40 hover:bg-emerald-700/60 border border-emerald-700/30 text-emerald-300 text-xs h-8" onClick={() => onMenuClick("Consultar cotações atualizadas de mercado")}>
                            {t('intelligence.dante-safra.dashboard.access')}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};


export default function DanteSafraChat() {
  const { user } = useUser();
  const { t, locale } = useLocale();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Setup State
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [setupStage, setSetupStage] = useState<DanteConversationStage>('PROPRIEDADE');
  const [nickname, setNickname] = useState<string | null>(null);
  const [propertyDetails, setPropertyDetails] = useState<Partial<PropertyDetails>>({});
  const [isMaximized, setIsMaximized] = useState(false);
  
  // Axis Upgrade State
  const [hasAxisUpgrade, setHasAxisUpgrade] = useState(false);
  const [isEligibleForAxis, setIsEligibleForAxis] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [axisTriggered, setAxisTriggered] = useState(false);

  const { playAudio, stopAudio, isPlaying, isLoadingAudio, playingId, warmUpAudio } = useNexusAudio();
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const hasTriggeredGreeting = useRef(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userInitials = useMemo(() => {
    if (!user?.displayName) return 'U';
    const names = user.displayName.split(' ');
    const initials = names.map((n) => n[0]).join('');
    return initials.slice(0, 2).toUpperCase();
  }, [user]);
  
  // Load setup status from Firestore and chat history from localStorage
  useEffect(() => {
    warmUpAudio();

    try {
      const savedState = localStorage.getItem('danteSafraChatHistory');
      if (savedState) {
        const { messages: savedMessages, setupStage: savedStage, nickname: savedNickname, propertyDetails: savedProps } = JSON.parse(savedState);
        if (savedMessages) setMessages(savedMessages);
        if (savedStage) setSetupStage(savedStage);
        if (savedStage === 'ANALISE' && savedNickname) {
          setNickname(savedNickname);
        } else {
          setNickname(null);
        }
        if (savedProps) setPropertyDetails(savedProps);
      }
    } catch (error) {
      console.error("VIX DIAGNOSTIC: Failed to load chat history from localStorage", error);
    }
    
    // TODO: buscar setup do usuário via Amplify Data / DynamoDB
    setIsInitialLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, warmUpAudio]);

  // Save full state to localStorage on change
  useEffect(() => {
    try {
      const stateToSave = { messages, setupStage, nickname, propertyDetails };
      localStorage.setItem('danteSafraChatHistory', JSON.stringify(stateToSave));
    } catch (error) {
      console.error("VIX DIAGNOSTIC: Failed to save chat history to localStorage", error);
    }
  }, [messages, setupStage, nickname, propertyDetails]);


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
      console.warn(t('intelligence.dante-safra.chat.speech_unsupported'));
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
      console.error(t('intelligence.dante-safra.chat.voice_error'), event.error);
      setIsRecording(false);
    };
    recognitionRef.current = recognition;
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  }, [messages]);

  const addMessage = useCallback((sender: Sender, data: { text: string } | DanteSafraOutput, imageUri?: string) => {
    const newMessage: Message = {
      id: Date.now(),
      sender,
      data,
      imageUri,
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  useEffect(() => {
    // Só dispara se não estiver carregando inicialmente, não houver mensagens e for estágio inicial
    if (!isInitialLoading && messages.length === 0 && setupStage === 'PROPRIEDADE' && !hasTriggeredGreeting.current) {
      hasTriggeredGreeting.current = true;
      
      // Reset onboarding state for a clean new client registration
      setNickname(null);
      setPropertyDetails({});
      
      const fetchAndPlayGreeting = async () => {
        setIsLoading(true);
        try {
          // Verifica se deve injetar a sugestão do AXIS (Gatilho de Confiança)
          if (isEligibleForAxis && !hasAxisUpgrade && !axisTriggered) {
             const axisMessage = t('chat.danteSafra.axisTrigger');
             const messageId = Date.now();
             addMessage('system', { response: axisMessage });
             playAudio({ text: axisMessage, voice: 'dante', id: messageId });
             setAxisTriggered(true);
             setIsLoading(false);
             return;
          }

          const response: DanteSafraOutput = await danteSafra({
            userMessage: "", 
            setupStage: "PROPRIEDADE",
            userName: 'Comandante',
            locale: locale,
          });
          
          if (response.response) {
            const messageId = Date.now();
            const greetingMessage: Message = {
              id: messageId,
              sender: 'system',
              data: response,
            };
            setMessages(prev => [...prev, greetingMessage]);
            playAudio({ text: response.response, voice: 'dante', id: messageId });
          }
          if (response.nextStage) {
            setSetupStage(response.nextStage);
          }
        } catch (error: any) {
           const errorText = t('chat.danteSafra.greetingError') + ` Telemetria: ${error.message || 'Erro desconhecido.'}`;
           addMessage('system', { response: errorText });
        } finally {
          setIsLoading(false);
        }
      };

      fetchAndPlayGreeting();
    }
  }, [isInitialLoading, setupStage, user, locale, isEligibleForAxis, hasAxisUpgrade, axisTriggered, t, playAudio, addMessage]);


  const processMessage = useCallback(async (text: string, imageUri?: string) => {
    if ((!text || !text.trim()) && !imageUri) return;

    stopAudio();

    const currentInput = text;
    addMessage('user', { text: currentInput }, imageUri);
    setInput('');
    setIsLoading(true);

    try {
      const historyForAI = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        text: 'text' in msg.data ? msg.data.text : msg.data.response,
      })).slice(-10);

      const response: DanteSafraOutput = await danteSafra({
        userMessage: currentInput,
        photoDataUri: imageUri,
        setupStage: setupStage,
        userName: setupStage === 'ANALISE' ? (nickname || user?.displayName || 'Comandante') : 'Comandante',
        propertyDetails: propertyDetails,
        locale: locale,
        history: historyForAI as { role: "user" | "model"; text: string }[],
      });
      
      if (!response || !response.response) {
        throw new Error(t('chat.danteSafra.error.protocol'));
      }

      const messageId = Date.now();

      addMessage('system', response);
      
      if (response.propertyDetails) {
        setPropertyDetails(prev => ({ ...prev, ...response.propertyDetails }));
      }

      if (response.nextStage === 'ANALISE' && setupStage !== 'ANALISE') {
        // TODO: salvar setup via Amplify Data / DynamoDB
      }

      const isTransitioningToMenu = response.nextStage === 'ANALISE';

      const handleStateUpdate = () => {
        if (response.newNickname) {
            setNickname(response.newNickname);
        }
        if (response.nextStage) {
            setSetupStage(response.nextStage);
        }
      };
      
      playAudio({ 
          text: response.response, 
          voice: 'dante', 
          id: messageId,
          onEnded: isTransitioningToMenu ? handleStateUpdate : undefined
      });

      if (!isTransitioningToMenu) {
          handleStateUpdate();
      }

    } catch (error: any) {
      const errorText = t('intelligence.dante-safra.chat.error', { error: error.message || 'Erro desconhecido.' });
      addMessage('system', { response: errorText });
    } finally {
      setIsLoading(false);
    }
  }, [stopAudio, addMessage, setupStage, nickname, user, playAudio, messages, propertyDetails]);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    processMessage(input);
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUri = e.target?.result as string;
        await processMessage(t('chat.danteSafra.submittingRetrofit'), imageUri);
      };
      reader.onerror = () => {
        addMessage('system', { response: t('chat.danteSafra.error.protocol') });
      };
      reader.readAsDataURL(file);
    }
    if(event.target) event.target.value = '';
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

  const placeholderText = useMemo(() => {
    if (isLoading) return t('intelligence.dante-safra.chat.loading');
    switch (setupStage) {
      case 'MUNICIPIO': return t('intelligence.dante-safra.chat.placeholder.municipio');
      case 'NOME': return t('intelligence.dante-safra.chat.placeholder.nome');
      case 'CONCLUSAO': return t('intelligence.dante-safra.chat.placeholder.conclusao');
      case 'ANALISE':
        return nickname ? t('intelligence.dante-safra.chat.placeholder.analise', { name: nickname }) : t('intelligence.dante-safra.chat.placeholder.conclusao');
      default:
        return t('intelligence.dante-safra.chat.placeholder.default');
    }
  }, [setupStage, isLoading, nickname, t]);


  if (isInitialLoading) {
      return (
          <div className="flex flex-col h-full items-center justify-center text-center">
              <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
              <p className="mt-4 text-gray-400">{t('chat.danteSafra.sync')}</p>
          </div>
      )
  }

  const renderMessages = () => (
      <div className="space-y-6">
        {messages.map((msg) => {
            const textToPlay = 'text' in msg.data ? msg.data.text : msg.data.response;

            return (
                <div key={msg.id} className={cn("flex items-start gap-2", msg.sender === 'user' ? "justify-end" : "justify-start")}>
                    {msg.sender === 'system' && (
                        <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src="/Nexus Empresas/dante safra.jpg" alt="Dante Safra" />
                        <AvatarFallback>DS</AvatarFallback>
                        </Avatar>
                    )}
                    <div className={cn("max-w-[85%] rounded-lg px-4 py-2 text-sm", msg.sender === 'user' ? "bg-emerald-700 text-white rounded-br-none" : "bg-gray-700/80 text-gray-200 rounded-bl-none")}>
                        {msg.imageUri && (
                        <img src={msg.imageUri} alt="Analisando imagem" className="rounded-md mb-2 w-full" />
                        )}
                        <p className="whitespace-pre-wrap flex-1">{textToPlay}</p>
                    </div>
                    {msg.sender === 'system' && (
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 shrink-0 self-center text-gray-400 hover:text-white"
                            onClick={() => {
                                if (playingId === msg.id) {
                                    stopAudio();
                                } else if (textToPlay) {
                                    playAudio({ text: textToPlay, voice: 'dante', id: msg.id });
                                }
                            }}
                        >
                            {isLoadingAudio && playingId === msg.id ? <Loader2 className="h-4 w-4 animate-spin" /> : (isPlaying && playingId === msg.id ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />)}
                            <span className="sr-only">{t('lectures.preview.play')}</span>
                        </Button>
                    )}
                    {msg.sender === 'user' && (
                        <Avatar className="w-8 h-8 flex-shrink-0">
                             <AvatarImage src={user?.photoURL ?? undefined} alt={user?.displayName ?? 'Avatar'} />
                            <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                    )}
                </div>
            )
        })}
        {isLoading && (
            <div className="flex items-center gap-2 justify-start">
            <Avatar className="w-8 h-8"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></Avatar>
            <div className="bg-gray-700/80 rounded-lg px-4 py-3 rounded-bl-none"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
            </div>
        )}
        </div>
  );

  return (
    <Card className={cn(
        "w-full max-w-3xl flex flex-col shadow-2xl border-emerald-800/60 relative",
        isMaximized ? "fixed inset-0 z-50 max-w-full h-full rounded-none" : "h-[70vh] min-h-[550px]"
    )}>
      <link rel="manifest" href="/dante-manifest.json" />
      <div className="absolute inset-0 bg-black/50 z-0" />
      <div className="relative z-10 flex flex-col h-full text-white">
        <CardHeader className="flex flex-row items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-emerald-500">
            <AvatarImage src="/Nexus Empresas/dante safra.jpg" alt="Dante Safra" />
            <AvatarFallback className="bg-emerald-800 text-white font-bold">DS</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="font-headline text-lg text-emerald-300">Dante Safra (Agronegócio)</CardTitle>
            <CardDescription className="text-gray-400">{t('intelligence.dante.description')}</CardDescription>
          </div>
            <div className="flex-1" />
            
            {hasAxisUpgrade ? (
               <Button 
                onClick={() => router.push('/intelligence/dante-safra/axis')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold animate-pulse gap-2 mr-2"
              >
                <Zap className="h-4 w-4" /> {t('intelligence.magaOs.cta')}
              </Button>
            ) : isEligibleForAxis && (
              <Button 
                onClick={() => setIsUpgradeModalOpen(true)}
                className="bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold border-none hover:scale-105 transition-all gap-2 mr-2 animate-glow shadow-[0_0_15px_rgba(245,158,11,0.4)]"
              >
                <Crown className="h-4 w-4" /> {t('courseDetail.goldPlan.cta')}
              </Button>
            )}

            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={() => setIsMaximized(!isMaximized)}>
               {isMaximized ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
             <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={() => router.back()}>
                <X className="h-4 w-4" />
            </Button>
            <div className="ml-2 border-l border-emerald-800/60 pl-2">
                <FeedbackDialog />
            </div>

            <IAPaymentModal 
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                iaName="Dante Safra Axis Elite"
                pixKey="+5551999799582"
                monthlyPrice="R$ 149,00"
                annualPrice="R$ 1.499,00"
                onSuccess={async () => {
                   // TODO: salvar upgrade via Amplify Data / DynamoDB
                   setHasAxisUpgrade(true);
                   setIsUpgradeModalOpen(false);
                   router.push('/intelligence/dante-safra/axis');
                }}
            />
        </CardHeader>
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto w-full min-h-0 custom-scrollbar p-4">
            {renderMessages()}
        </div>
          <CardFooter className="p-4 border-t border-emerald-800/60 flex flex-col items-start gap-2">
              <form onSubmit={handleFormSubmit} className="flex w-full items-start gap-2">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} disabled={isLoading || setupStage !== 'ANALISE'} />
                <Button type="button" size="icon" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isLoading || setupStage !== 'ANALISE'} className={cn(setupStage !== 'ANALISE' && 'opacity-50 cursor-not-allowed', "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white")}>
                    <CameraIcon className="w-5 h-5" />
                    <span className="sr-only">{t('chat.danteSafra.uploadPrompt')}</span>
                </Button>
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleFormSubmit(e); } }}
                  placeholder={placeholderText}
                  autoComplete="off"
                  disabled={isLoading}
                  rows={1}
                  className="max-h-40 min-h-10 resize-none bg-black/40 border-gray-600 text-gray-200 placeholder:text-gray-500 focus:border-emerald-500"
                />
                 <Button type="button" size="icon" variant={isRecording ? "destructive" : "outline"} onClick={handleMicClick} disabled={isLoading} className={cn(!isRecording && "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white")}>
                    <Mic className="w-5 h-5" />
                    <span className="sr-only">{t('chat.danteSafra.input.setup')}</span>
                </Button>
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                  <Send className="w-5 h-5" />
                  <span className="sr-only">{t('contact.form.cta')}</span>
                </Button>
              </form>
              <p className="w-full pt-1 text-center text-xs text-gray-500">{t('intelligence.footer')}</p>
            </CardFooter>
      </div>
    </Card>
  );
}
