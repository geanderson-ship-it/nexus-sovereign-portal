'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Play, Square, Loader2, Volume2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const VOICES = [
  {
    id: 'pt-BR-FranciscaNeural',
    name: 'Francisca',
    description: 'Voz madura, extremamente profissional e expressiva. Suporta múltiplos estilos emocionais.',
    styles: ['none', 'cheerful', 'calm', 'excited', 'sad']
  },
  {
    id: 'pt-BR-ThalitaNeural',
    name: 'Thalita',
    description: 'Conversacional, leve, moderna e simpática. Ótima para assistentes interativos.',
    styles: ['none', 'cheerful', 'excited', 'sad']
  },
  {
    id: 'pt-BR-YaraNeural',
    name: 'Yara',
    description: 'Voz extremamente suave, amigável e natural. Perfeita para uma fala calma e acolhedora.',
    styles: ['none']
  },
  {
    id: 'pt-BR-ElzaNeural',
    name: 'Elza',
    description: 'Voz madura com postura executiva e corporativa de alto escalão. Clara e firme.',
    styles: ['none']
  },
  {
    id: 'pt-BR-BrendaNeural',
    name: 'Brenda',
    description: 'Voz altamente expressiva e dramática, excelente para locuções de rádio e destaque comercial.',
    styles: ['none']
  },
  {
    id: 'pt-BR-LeticiaNeural',
    name: 'Leticia',
    description: 'Conversacional e descontraída. Soa muito natural e informal.',
    styles: ['none']
  }
];

export default function VoiceTestPage() {
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0]);
  const [selectedStyle, setSelectedStyle] = useState('cheerful');
  const [text, setText] = useState('Olá! Eu sou a Atena, a sua inteligência artificial exclusiva da Nexus Holding Group. Como posso ajudar você hoje no nosso gabinete de elite?');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const handleTest = async () => {
    if (!text.trim()) return;
    setLoading(true);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    if (audioElement) {
      audioElement.pause();
      setPlaying(false);
    }

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          gender: 'female',
          locale: 'pt-BR',
          voiceId: selectedVoice.id,
          style: selectedStyle
        })
      });

      if (!res.ok) throw new Error('Falha ao gerar o áudio.');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      const audio = new Audio(url);
      setAudioElement(audio);

      audio.onplay = () => setPlaying(true);
      audio.onended = () => setPlaying(false);
      audio.onerror = () => {
        setPlaying(false);
        alert('Erro ao reproduzir o áudio.');
      };

      await audio.play();
    } catch (err) {
      console.error(err);
      alert('Erro ao sintetizar voz do Azure.');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = () => {
    if (audioElement) {
      audioElement.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#02050a] text-slate-100 font-sans p-6 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background Cyber Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* Aurora light effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl z-10 space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-xs text-blue-400 font-medium">
            <span>Nexus Voice Lab</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
            Estúdio de Vozes da <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-accent">Atena</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-md">
            Escolha a voz ideal para a sua Inteligência Artificial Soberana. Teste e compare as vozes femininas de alta definição da Microsoft Azure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar - Voice Selection */}
          <div className="md:col-span-1 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 px-1">
              Selecione a Voz
            </h2>
            <div className="space-y-2">
              {VOICES.map((v) => {
                const isSelected = selectedVoice.id === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVoice(v);
                      setSelectedStyle(v.styles.includes('cheerful') ? 'cheerful' : 'none');
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex flex-col space-y-1 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/5'
                        : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-medium text-white flex items-center space-x-2">
                      <span>{v.name}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                    </span>
                    <span className="text-xs text-slate-400 leading-relaxed">
                      {v.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main content - Settings & Playback */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-xl">
              <CardHeader className="border-b border-slate-800">
                <CardTitle className="text-white text-lg">Configurações de Expressão</CardTitle>
                <CardDescription className="text-slate-400">
                  Ajuste o comportamento emocional da voz selecionada.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Style selection */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Estilo de Fala (Emoção)
                  </label>
                  {selectedVoice.styles.length > 1 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {selectedVoice.styles.map((style) => (
                        <button
                          key={style}
                          onClick={() => setSelectedStyle(style)}
                          className={`px-3 py-2 rounded-lg border text-xs font-medium capitalize transition-all ${
                            selectedStyle === style
                              ? 'border-blue-500 bg-blue-500/5 text-blue-400'
                              : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {style === 'none' ? 'Natural' : style === 'cheerful' ? 'Sorridente' : style === 'calm' ? 'Calmo' : style === 'excited' ? 'Entusiasmado' : style}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-900 leading-relaxed">
                      Esta voz tem apenas a entonação padrão (Conversacional Natural). As vozes <strong className="text-slate-200">Francisca</strong> e <strong className="text-slate-200">Thalita</strong> oferecem controle emocional dinâmico.
                    </div>
                  )}
                </div>

                {/* Text input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Texto para Síntese
                  </label>
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    className="border-slate-800 bg-slate-950/60 focus:border-blue-500 text-white placeholder-slate-600 resize-none leading-relaxed"
                    placeholder="Digite a frase que deseja ouvir..."
                  />
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-4">
                  <div className="text-xs text-slate-500 flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-blue-400" />
                    <span>Prosódia: Taxa +8% | Pitch +0% (Ajuste Feminino Padrão)</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    {playing && (
                      <Button
                        variant="outline"
                        onClick={handleStop}
                        className="border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 w-full sm:w-auto"
                      >
                        <Square className="w-4 h-4 mr-2" /> Parar
                      </Button>
                    )}

                    <Button
                      onClick={handleTest}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/10 w-full sm:w-auto font-medium"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sintetizando...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2 fill-current" /> Gerar e Ouvir
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Back Link */}
        <div className="flex justify-center pt-4">
          <Link href="/gabinete/vision" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            Voltar para o Painel Vision
          </Link>
        </div>
      </div>
    </div>
  );
}
