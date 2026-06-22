'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useHeyGenStream } from '@/hooks/use-heygen-stream';
import { useLectureEngine } from '@/hooks/use-lecture-engine';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Play, Pause, Square, MessageSquare, Send, Settings, User, Bot, Volume2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LiveLecturePlayerProps {
    course: any;
    scriptChunks: {speaker: string, text: string}[];
    speakers: {name: string, image: string, alt: string}[];
}

export default function LiveLecturePlayer({ course, scriptChunks, speakers }: LiveLecturePlayerProps) {
    const { stream, isConnecting, isConnected, isSpeaking, initializeSession, speak, closeSession } = useHeyGenStream();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [mockMode, setMockMode] = useState(false);
    
    // Q&A State
    const [messages, setMessages] = useState<{role: 'user'|'avatar', text: string}[]>([]);
    const [inputMsg, setInputMsg] = useState('');
    const [isThinking, setIsThinking] = useState(false);

    // Mock Mode Speech Synthesis via AWS Polly
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleSpeakChunk = async (chunkText: string, forcedSpeaker?: string) => {
        if (mockMode || !isConnected) {
            // TTS Mock Fallback via AWS Polly
            return new Promise<void>(async (resolve, reject) => {
                const speakerName = forcedSpeaker || 'Dante';
                const gender = speakerName === 'Dante' ? 'male' : 'female';
                
                try {
                    const response = await fetch('/api/tts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: chunkText, gender })
                    });
                    
                    if (!response.ok) throw new Error('Falha ao gerar áudio com AWS Polly');
                    
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    const audio = new Audio(url);
                    audioRef.current = audio;
                    
                    audio.onended = () => {
                        URL.revokeObjectURL(url);
                        audioRef.current = null;
                        resolve();
                    };
                    
                    audio.onerror = (e) => {
                        URL.revokeObjectURL(url);
                        audioRef.current = null;
                        reject(e);
                    };
                    
                    audio.play();
                } catch (e) {
                    console.error('AWS Polly error:', e);
                    resolve(); // resolve to not block the lecture
                }
            });
        } else {
            // HeyGen API
            await speak(chunkText);
        }
    };

    const handleInterrupt = () => {
        if (mockMode && audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        // HeyGen stop logic would go here if needed (e.g. stopAvatarTask)
    };

    const handleEngineSpeak = async (chunk: any) => {
        // Since we changed scriptChunks to object, chunk is now {speaker, text}
        // But the useLectureEngine passes the whole item from the array.
        const chunkObj = chunk as unknown as {speaker: string, text: string};
        await handleSpeakChunk(chunkObj.text, chunkObj.speaker);
    }

    const {
        state,
        currentChunkIndex,
        isPaused,
        progress,
        startLecture,
        pauseLecture,
        resumeLecture,
        stopLecture,
        enterQandA
    } = useLectureEngine({
        chunks: scriptChunks as any,
        onSpeakChunk: handleEngineSpeak,
        onInterrupt: handleInterrupt
    });

    const activeSpeakerName = state === 'PRESENTING' && scriptChunks[currentChunkIndex] 
        ? scriptChunks[currentChunkIndex].speaker 
        : (speakers[0]?.name || 'Dante');
        
    const activeSpeakerImg = speakers.find(s => s.name === activeSpeakerName)?.image || speakers[0]?.image || '/assets/dante-placeholder.png';

    const handleStart = async () => {
        // Try HeyGen first
        const success = await initializeSession(activeSpeakerName === 'Dante' ? 'dante_avatar_id' : 'djeny_avatar_id');
        if (!success) {
            // Fallback to Mock Mode
            setMockMode(true);
        }
        startLecture();
    };

    // Attach video stream
    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    const handleSendQuestion = async () => {
        if (!inputMsg.trim()) return;
        const msg = inputMsg.trim();
        setInputMsg('');
        setMessages(prev => [...prev, { role: 'user', text: msg }]);
        setIsThinking(true);

        try {
            const response = await fetch('/api/lecture-qa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: msg,
                    lectureSlug: course.slug,
                    speakerName: activeSpeakerName
                })
            });
            const data = await response.json();
            if (data.answer) {
                setMessages(prev => [...prev, { role: 'avatar', text: data.answer }]);
                setIsThinking(false);
                await handleSpeakChunk(data.answer, activeSpeakerName);
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Error fetching Q&A answer:', error);
            const fallback = "Desculpe, estou com uma instabilidade na conexão agora. Pode repetir a pergunta?";
            setMessages(prev => [...prev, { role: 'avatar', text: fallback }]);
            setIsThinking(false);
            await handleSpeakChunk(fallback, activeSpeakerName);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl mx-auto p-4">
            {/* Esquerda: Player de Vídeo e Controles */}
            <div className="flex-1 space-y-4">
                <div className="relative aspect-video bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl group">
                    {/* Indicador de Status */}
                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                        {state === 'PRESENTING' && <span className="bg-red-500/20 text-red-500 border border-red-500/50 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-2 backdrop-blur-sm animate-pulse"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Ao Vivo</span>}
                        {mockMode && <span className="bg-amber-500/20 text-amber-400 border border-amber-500/50 px-3 py-1 rounded-full text-xs font-bold uppercase backdrop-blur-sm">Modo Simulação</span>}
                        {(isSpeaking || (mockMode && state === 'PRESENTING' && !isPaused)) && <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-2 backdrop-blur-sm"><Volume2 className="w-3 h-3" /> {activeSpeakerName} Falando</span>}
                    </div>

                    {/* HeyGen Stream ou Mock Image */}
                    {stream && !mockMode ? (
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full relative flex items-center justify-center">
                            <Image src={course.image?.src || activeSpeakerImg} alt={course.title} fill className="object-cover opacity-80 transition-all duration-500" />
                            {state === 'CONNECTING' && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-primary font-mono text-sm animate-pulse">Conectando ao Estúdio...</p>
                                    </div>
                                </div>
                            )}
                            {state === 'IDLE' && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm transition-opacity group-hover:bg-black/40">
                                    <Button size="lg" onClick={handleStart} className="w-24 h-24 rounded-full bg-primary/90 hover:bg-primary shadow-[0_0_50px_rgba(16,185,129,0.3)] hover:scale-105 transition-all">
                                        <Play className="w-10 h-10 ml-2" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Legenda Dinâmica (apenas na Palestra) */}
                    {state === 'PRESENTING' && scriptChunks[currentChunkIndex] && (
                        <div className="absolute bottom-6 left-0 right-0 px-12 z-20">
                            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-4 text-center">
                                <p className="text-white text-lg font-medium drop-shadow-md">
                                    {scriptChunks[currentChunkIndex].text}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Controles de Reprodução */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center gap-4 mb-4">
                        {state === 'PRESENTING' && !isPaused ? (
                            <Button variant="outline" size="icon" onClick={pauseLecture}>
                                <Pause className="w-5 h-5" />
                            </Button>
                        ) : (
                            <Button variant="outline" size="icon" onClick={state === 'IDLE' ? handleStart : resumeLecture} disabled={state === 'CONNECTING' || state === 'FINISHED' || state === 'Q_AND_A'}>
                                <Play className="w-5 h-5" />
                            </Button>
                        )}
                        <Button variant="outline" size="icon" onClick={stopLecture} disabled={state === 'IDLE' || state === 'FINISHED'}>
                            <Square className="w-5 h-5" />
                        </Button>
                        
                        <div className="flex-1">
                            <Progress value={progress} className="h-2" />
                        </div>
                        <span className="text-xs text-zinc-400 font-mono w-16 text-right">
                            {Math.round(progress)}%
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Settings className="w-4 h-4" />
                            <span>Qualidade: 1080p (Auto)</span>
                        </div>
                        {state === 'PRESENTING' && (
                            <Button variant="secondary" size="sm" onClick={enterQandA}>
                                Pular para Q&A
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Direita: Painel de Q&A (Desbloqueado no final) */}
            <div className="w-full md:w-96 flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden h-[600px]">
                <div className="bg-zinc-950 p-4 border-b border-zinc-800">
                    <h3 className="font-headline font-bold flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        Live Q&A
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">Interaja em tempo real com o avatar.</p>
                </div>

                {state !== 'Q_AND_A' ? (
                    <div className="flex-1 flex items-center justify-center p-6 text-center">
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                                <MessageSquare className="w-8 h-8 text-zinc-600" />
                            </div>
                            <p className="text-zinc-500 font-medium">O painel de Q&A será desbloqueado ao final da apresentação.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm text-primary">
                                    <p className="font-bold mb-1">Apresentação concluída!</p>
                                    <p>O palco agora é seu. Qual é a sua dúvida sobre o tema?</p>
                                </div>
                                
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                                            {msg.role === 'user' ? <User className="w-4 h-4 text-zinc-400" /> : <Bot className="w-4 h-4 text-primary" />}
                                        </div>
                                        <div className={cn("rounded-lg p-3 max-w-[85%] text-sm", msg.role === 'user' ? "bg-zinc-800 text-white" : "bg-zinc-950 border border-zinc-800 text-zinc-300")}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {isThinking && (
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                                            <Bot className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-.15s]"></span>
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-.3s]"></span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                        
                        <div className="p-4 bg-zinc-950 border-t border-zinc-800">
                            <div className="flex gap-2">
                                <Input 
                                    placeholder="Digite sua pergunta..." 
                                    className="bg-zinc-900 border-zinc-800"
                                    value={inputMsg}
                                    onChange={(e) => setInputMsg(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendQuestion()}
                                    disabled={isThinking}
                                />
                                <Button size="icon" onClick={handleSendQuestion} disabled={!inputMsg.trim() || isThinking}>
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
