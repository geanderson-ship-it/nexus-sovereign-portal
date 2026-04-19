
'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CloudUpload, AlertTriangle, Maximize, Sparkles, Mic, Pause, Volume2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';
import { djenyDesign } from '@/ai/flows/djeny-design-flow';
import type { DjenyDesignOutput } from '@/ai/flows/djeny-design-types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNexusAudio } from '@/hooks/use-nexus-audio';
import { useLocale } from '@/hooks/use-locale';


// Helper function to resize images before upload
const resizeImage = (file: File, maxWidth: number, quality: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (!event.target?.result) return reject(new Error("FileReader did not return a result."));
            const img = new window.Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Could not get canvas context'));
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = (err) => reject(err);
            img.src = event.target.result as string;
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
};

const DesignStudio = () => {
    const { t } = useLocale();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const recognitionRef = React.useRef<SpeechRecognition | null>(null);

    const [originalImage, setOriginalImage] = React.useState<string | null>(null);
    const [selectedRoom, setSelectedRoom] = React.useState<string | null>(null);
    const [selectedStyle, setSelectedStyle] = React.useState<string | null>(null);
    const [prompt, setPrompt] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [result, setResult] = React.useState<DjenyDesignOutput | null>(null);
    const [zoomedImage, setZoomedImage] = React.useState<string | null>(null);
    const [isRecording, setIsRecording] = React.useState(false);
    const [narration, setNarration] = React.useState<string | null>(null);
    const [refinementPrompt, setRefinementPrompt] = React.useState<string>('');
    const [isRefining, setIsRefining] = React.useState(false);

    const roomTypes = [
        { id: 'living', label: 'Sala', icon: '🛋️' },
        { id: 'bedroom', label: 'Quarto', icon: '🛏️' },
        { id: 'kitchen', label: 'Cozinha', icon: '🍳' },
        { id: 'office', label: 'Escritório', icon: '💻' },
        { id: 'gourmet', label: 'Gourmet', icon: '🍷' },
    ];

    const designStyles = [
        { id: 'modern', label: 'Moderno' },
        { id: 'industrial', label: 'Industrial' },
        { id: 'minimalist', label: 'Minimalista' },
        { id: 'classic', label: 'Clássico' },
        { id: 'luxury', label: 'Luxo' },
    ];

    const { playAudio, stopAudio, isPlaying, isLoadingAudio } = useNexusAudio();
    
    // Speech Recognition Setup
    React.useEffect(() => {
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
            setPrompt(transcript);
        };
        recognition.onend = () => setIsRecording(false);
        recognition.onerror = (event) => {
            console.error('Erro no reconhecimento de voz:', event.error);
            setIsRecording(false);
        };
        recognitionRef.current = recognition;
    }, []);

    const [usageCount, setUsageCount] = React.useState(0);
    const [isPremiumLocked, setIsPremiumLocked] = React.useState(false);
    
    const LIMIT = 1;

    // Load usage count and lock state
    React.useEffect(() => {
        const storedCount = localStorage.getItem('nexus_djeny_usage');
        const count = storedCount ? parseInt(storedCount, 10) : 0;
        setUsageCount(count);
        if (count >= LIMIT) {
            setIsPremiumLocked(true);
        }
    }, []);

    const incrementUsage = () => {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem('nexus_djeny_usage', newCount.toString());
        if (newCount >= LIMIT) {
            setIsPremiumLocked(true);
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isPremiumLocked) return;
        const file = event.target.files?.[0];
        if (file) {
            stopAudio();
            setResult(null);
            setError(null);
            setNarration(null);
            setIsLoading(true);
            try {
                const imageUri = await resizeImage(file, 1024, 0.8);
                setOriginalImage(imageUri);
            } catch (err: any) {
                setError(t('chat.djenyDesign.error.processImage'));
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isPremiumLocked) return;
        if (!originalImage || !prompt || isLoading) return;
        
        stopAudio();
        setIsLoading(true);
        setError(null);
        setResult(null);
        setNarration(null);

        try {
            let finalUserMessage = `Ambiente: ${selectedRoom ? roomTypes.find(r => r.id === selectedRoom)?.label : 'Não especificado'}. Estilo: ${selectedStyle ? designStyles.find(s => s.id === selectedStyle)?.label : 'Não especificado'}. Detalhes: ${prompt}`;
            
            if (isRefining && refinementPrompt) {
                finalUserMessage = `REFINAMENTO DO PROJETO ANTERIOR: ${refinementPrompt}. CONSIDERE O CONTEXTO ANTERIOR: ${prompt}`;
            }

            const response = await djenyDesign({
                photoDataUri: originalImage,
                userMessage: finalUserMessage,
            });
            setResult(response);
            if (response.description) {
                setNarration(response.description);
                playAudio({ text: response.description, voice: 'djeny', id: 'design-narration' });
            }
            setRefinementPrompt('');
            setIsRefining(false);
            
            // Increment usage after successful generation
            if (!isRefining) {
                incrementUsage();
            }
        } catch (err: any) {
            setError(err.message || t('chat.djenyDesign.error.generic'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefitSubmit = async () => {
        if (!refinementPrompt || isLoading) return;
        setIsRefining(true);
        handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>);
    };

    const handleMicClick = () => {
        const recognition = recognitionRef.current;
        if (!recognition) return;
        if (isRecording) {
            recognition.stop();
        } else {
            stopAudio();
            setPrompt('');
            recognition.start();
            setIsRecording(true);
        }
    };

    const handleAudioControl = () => {
        if (isPlaying || isLoadingAudio) {
            stopAudio();
        } else if (narration) {
            playAudio({ text: narration, voice: 'djeny', id: 'design-narration' });
        }
    };

    const handleCopyPix = () => {
        const pixKey = "00020126580014BR.GOV.BCB.PIX0114+551199999999952040000530398654071500.005802BR5915NexusPremium6009SaoPaulo62070503***6304ABCD";
        navigator.clipboard.writeText(pixKey);
    };

    const handleSendProof = () => {
        const phone = "5511999999999"; // User should change this
        const msg = encodeURIComponent(t('chat.djenyDesign.payment.whatsappMsg'));
        window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    };
    
    return (
        <Card className="bg-black/30 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                    <CardTitle className="font-headline text-accent flex items-center gap-3"><Sparkles/> {t('chat.djenyDesign.studioTitle')}</CardTitle>
                    <CardDescription>{t('chat.djenyDesign.studioDescription')}</CardDescription>
                </div>
                {usageCount < LIMIT && (
                    <div className="flex items-center gap-2 bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                        <div className="h-2 w-2 rounded-full bg-accent animate-pulse"></div>
                        <span className="text-[10px] uppercase font-bold text-accent tracking-tighter">
                            {LIMIT - usageCount} {LIMIT - usageCount === 1 ? 'Teste Restante' : 'Testes Restantes'}
                        </span>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Dialog open={zoomedImage !== null} onOpenChange={(open) => { if (!open) setZoomedImage(null); }}>
                        <DialogContent className="max-w-[90vw] h-[90vh] bg-transparent border-0 shadow-none p-2">
                             <DialogDescription className="sr-only">
                                Imagem ampliada da proposta de design.
                            </DialogDescription>
                            {zoomedImage && <Image src={zoomedImage} alt="Proposta de Retrofit" fill sizes="90vw" style={{ objectFit: 'contain' }} />}
                        </DialogContent>
                    </Dialog>

                    {isPremiumLocked ? (
                        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                            <Alert className="bg-accent/10 border-accent/40 text-accent py-6 text-center flex flex-col items-center">
                                <AlertTriangle className="h-8 w-8 mb-2" />
                                <AlertTitle className="text-xl font-headline italic">{t('chat.djenyDesign.trial.limitReached')}</AlertTitle>
                                <AlertDescription className="text-sm opacity-80 max-w-md mx-auto">
                                    {t('chat.djenyDesign.payment.subtitle')}
                                </AlertDescription>
                            </Alert>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-black/40 p-8 rounded-2xl border border-gray-800">
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-headline text-2xl text-accent">{t('chat.djenyDesign.payment.title')}</h4>
                                        <p className="text-3xl font-bold text-white mt-2">{t('chat.djenyDesign.payment.price')}</p>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <p className="text-xs text-gray-400 uppercase tracking-widest">{t('chat.djenyDesign.payment.copyPasteLabel')}</p>
                                            <div className="flex gap-2">
                                                <div className="bg-black/60 border border-gray-800 px-3 py-2 rounded text-[10px] font-mono text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                                                    00020126580014BR.GOV.BCB.PIX0114...
                                                </div>
                                                <Button size="sm" variant="outline" className="border-accent/40 text-accent hover:bg-accent/10 shrink-0" onClick={handleCopyPix}>
                                                    {t('chat.djenyDesign.payment.copyButton')}
                                                </Button>
                                            </div>
                                        </div>

                                        <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 shadow-lg shadow-emerald-900/20" onClick={handleSendProof}>
                                            {t('chat.djenyDesign.payment.sendProof')}
                                        </Button>
                                        
                                        <p className="text-[10px] text-gray-500 text-center italic leading-tight">
                                            {t('chat.djenyDesign.payment.info')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-xl border border-white/5 space-y-4">
                                    <p className="text-xs text-accent font-semibold uppercase tracking-widest">{t('chat.djenyDesign.payment.qrCodeLabel')}</p>
                                    <div className="bg-white p-2 rounded-lg relative overflow-hidden shadow-2xl">
                                        <Image 
                                            src="/assets/nexus/pix-djeny-premium.png" 
                                            alt="PIX QR Code Nexus" 
                                            width={240} 
                                            height={240}
                                            className="opacity-100"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <div 
                                    className="aspect-video w-full rounded-t-md bg-black/50 border-2 border-dashed border-accent/30 flex items-center justify-center overflow-hidden relative cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {originalImage ? (
                                        <Image src={originalImage} alt="Ambiente a ser analisado" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                                    ) : (
                                        <div className="text-center text-accent/80 p-4">
                                            <CloudUpload className="mx-auto h-8 w-8" />
                                            <p className="mt-2 text-sm font-semibold">{t('chat.djenyDesign.uploadPrompt')}</p>
                                            <p className="mt-1 text-xs text-accent/60">{t('chat.djenyDesign.uploadNote')}</p>
                                        </div>
                                    )}
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                </div>
                                 <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold rounded-t-none h-12 text-lg shadow-lg shadow-accent/20" disabled={isLoading || !originalImage}>
                                    {isLoading && !isRefining ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                                    {isLoading && !isRefining ? t('chat.djenyDesign.submittingRetrofit') : "Enviar Solicitação Principal"}
                                </Button>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-accent/70 uppercase tracking-wider">Tipo de Ambiente</label>
                                    <div className="flex flex-wrap gap-2">
                                        {roomTypes.map((room) => (
                                            <Button 
                                                key={room.id}
                                                type="button"
                                                variant={selectedRoom === room.id ? "default" : "outline"}
                                                size="sm"
                                                className={selectedRoom === room.id ? "bg-accent text-accent-foreground" : "border-gray-800 text-gray-400"}
                                                onClick={() => setSelectedRoom(room.id)}
                                            >
                                                <span className="mr-2">{room.icon}</span> {room.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-accent/70 uppercase tracking-wider">Estilo Desejado</label>
                                    <div className="flex flex-wrap gap-2">
                                        {designStyles.map((style) => (
                                            <Button 
                                                key={style.id}
                                                type="button"
                                                variant={selectedStyle === style.id ? "default" : "outline"}
                                                size="sm"
                                                className={selectedStyle === style.id ? "bg-accent text-accent-foreground" : "border-gray-800 text-gray-400"}
                                                onClick={() => setSelectedStyle(style.id)}
                                            >
                                                {style.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="prompt" className="font-headline text-sm text-accent">Detalhes e Personalização</label>
                                    <p className="text-xs text-gray-400 mb-1">
                                        Descreva móveis específicos, cores de parede e equipamentos.
                                    </p>
                                    <div className="relative">
                                        <Textarea 
                                            id="prompt"
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="Ex: Quero uma parede azul marinho, um sofá de couro conhaque e uma TV de 75 polegadas..."
                                            rows={4}
                                            className="bg-black/30 border-gray-700 mt-1 pr-12 focus:border-accent"
                                            disabled={isLoading}
                                        />
                                         <Button 
                                            type="button" 
                                            size="icon" 
                                            variant={isRecording ? "destructive" : "ghost"} 
                                            onClick={handleMicClick} 
                                            className="absolute bottom-2 right-2"
                                            disabled={isLoading || !recognitionRef.current}
                                        >
                                            <Mic className="w-5 h-5" />
                                            <span className="sr-only">Gravar Voz</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                    
                    {error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>{t('chat.djenyDesign.error.protocol')}</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {isLoading && !result && (
                        <div className="text-center text-accent pt-4">
                            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                            <p className="mt-2 text-sm font-semibold">{t('chat.djenyDesign.loading.creating')}</p>
                        </div>
                    )}

                    {result && !isLoading && (
                        <div className="space-y-6 pt-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-2 justify-center">
                                <div className="h-px bg-accent/30 flex-1"></div>
                                <h3 className="font-headline text-xl text-accent px-4 uppercase tracking-tighter">Proposta de Design Nexus</h3>
                                <div className="h-px bg-accent/30 flex-1"></div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-center text-xs font-semibold text-gray-500 uppercase tracking-widest">Ambiente Cru</p>
                                    <Card className="bg-black/40 border-gray-800 overflow-hidden relative group">
                                        <div className="aspect-video w-full relative grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500">
                                            <Image src={originalImage!} alt="Original" fill sizes="45vw" style={{ objectFit: 'cover' }} />
                                        </div>
                                    </Card>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-center text-xs font-semibold text-accent uppercase tracking-widest">Ambiente Decorado</p>
                                    <Card className="bg-black/40 border-accent/40 shadow-xl shadow-accent/5 overflow-hidden relative">
                                        <div className="aspect-video w-full relative">
                                            <Image src={result.imageUri} alt="Decorado" fill sizes="45vw" style={{ objectFit: 'cover' }} />
                                            <Button size="icon" variant="ghost" className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white h-10 w-10 backdrop-blur-md" onClick={() => setZoomedImage(result.imageUri)}>
                                                <Maximize className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            <div className="bg-accent/5 border border-accent/20 rounded-xl p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-accent">
                                        <Sparkles className="h-5 w-5" />
                                        <h4 className="font-headline text-lg italic">{t('chat.djenyDesign.proposalAnalysis')}</h4>
                                    </div>
                                    <Button variant="outline" size="icon" className="border-accent/30 hover:bg-accent/10" onClick={handleAudioControl} disabled={isLoadingAudio || !narration}>
                                        {isLoadingAudio ? <Loader2 className="h-5 w-5 animate-spin text-accent" /> : isPlaying ? <Pause className="h-5 w-5 text-accent" /> : <Volume2 className="h-5 w-5 text-accent opacity-70" />}
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-300 leading-relaxed font-light">"{result.description}"</p>
                                <p className="text-[10px] text-center text-gray-500/60 uppercase tracking-widest pt-2">{t('chat.djenyDesign.audioDisclaimer')}</p>
                            </div>

                            <div className="pt-8 space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-accent animate-pulse"></div>
                                    <h5 className="font-headline text-sm text-accent">Sugestões e Refinamentos</h5>
                                </div>
                                <div className="relative group">
                                    <Textarea 
                                        placeholder="Ex: Não gostei dessa cor, mude a parede para azul petróleo e troque a poltrona por uma reclinável preta..."
                                        value={refinementPrompt}
                                        onChange={(e) => setRefinementPrompt(e.target.value)}
                                        className="bg-black/40 border-gray-800 focus:border-accent min-h-[100px] pr-12 transition-all duration-300"
                                        disabled={isLoading}
                                    />
                                    <Button 
                                        className="absolute bottom-3 right-3 bg-accent/80 hover:bg-accent text-accent-foreground"
                                        size="sm"
                                        onClick={handleRefitSubmit}
                                        disabled={isLoading || !refinementPrompt}
                                    >
                                        {isLoading && isRefining ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                                        Refinar Projeto
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                    <p className="text-xs text-center text-gray-500/80 mt-4">{t('chat.djenyDesign.disclaimer')}</p>
                </div>
            </CardContent>
        </Card>
    );
};


export function DjenyDesignModule() {
  return (
    <ScrollArea className="h-[80vh] w-full">
        <div className="py-4 space-y-4 pr-6">
            <div className="animate-in fade-in-0 space-y-4">
                <DesignStudio />
            </div>
        </div>
    </ScrollArea>
  );
}
