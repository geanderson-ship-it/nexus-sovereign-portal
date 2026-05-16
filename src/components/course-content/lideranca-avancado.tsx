'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Shield, Heart, ArrowRight, Play, Pause, Loader2, Award } from 'lucide-react';
import { eventEmitter } from '@/auth/event-emitter';
import type { Course } from '@/lib/courses-data';
import { useNexusAudio } from '@/hooks/use-nexus-audio';
import { useLocale } from '@/hooks/use-locale';

export default function LiderancaAvancadoContent({ course, isPurchased }: { course: Course; isPurchased: boolean }) {
  const [activeStage, setActiveStage] = useState<Record<number, 'dante' | 'djeny'>>({});
  const { playAudio, stopAudio, isPlaying, isLoadingAudio, playingId } = useNexusAudio();
  const { t, tObject } = useLocale();

  const courseData = tObject<any[]>('courses.lideranca-avancado.data') || [];

  return (
    <div className="space-y-4">
        <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-primary font-headline">{t('courses.lideranca-avancado.header.title')}</h2>
            <p className="text-muted-foreground mt-2 max-w-3xl mx-auto">
                {t('courses.lideranca-avancado.header.desc')}
            </p>
        </div>
        <div className="text-left mb-8 prose prose-sm prose-invert max-w-none text-foreground space-y-6">
            <h2 className="text-2xl font-bold text-primary font-headline">{t('courses.lideranca-avancado.intro.title')}</h2>
            
            <div>
                <h3 className="font-bold text-lg text-primary">{t('courses.lideranca-avancado.intro.stage.title')}</h3>
                <p><strong>Dante:</strong> "{t('courses.lideranca-avancado.intro.stage.dante')}"</p>
                <p><strong>Djeny:</strong> "{t('courses.lideranca-avancado.intro.stage.djeny')}"</p>
            </div>

            <div>
                <h3 className="font-bold text-lg text-primary">{t('courses.lideranca-avancado.intro.philosophy.title')}</h3>
                <p><strong>Dante:</strong> "{t('courses.lideranca-avancado.intro.philosophy.dante')}"</p>
                <p><strong>Djeny:</strong> "{t('courses.lideranca-avancado.intro.philosophy.djeny')}"</p>
            </div>
            
            <div>
                <h3 className="font-bold text-lg text-primary">{t('courses.lideranca-avancado.intro.master.title')}</h3>
                <p><strong>Dante:</strong> "{t('courses.lideranca-avancado.intro.master.dante')}"</p>
                <p><strong>Djeny:</strong> "{t('courses.lideranca-avancado.intro.master.djeny')}"</p>
            </div>

            <div>
                <h3 className="font-bold text-lg text-primary">{t('courses.lideranca-avancado.intro.call.title')}</h3>
                <p><strong>Dante:</strong> "{t('courses.lideranca-avancado.intro.call.dante')}"</p>
                <p><strong>Djeny:</strong> "{t('courses.lideranca-avancado.intro.call.djeny')}"</p>
                <p><strong>Dante & Djeny:</strong> "{t('courses.lideranca-avancado.intro.call.final')}"</p>
            </div>
        </div>
      <Accordion type="single" collapsible className="w-full">
        {courseData.map((item: any, index: number) => {
            const stage = activeStage[index];
            const danteAudioId = `dante-avancado-${index}`;
            const djenyAudioId = `djeny-avancado-${index}`;

            return (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>
                    <div className="text-left">
                        <p className="text-sm font-semibold text-primary">{item.module}</p>
                        <p className="font-bold text-lg text-foreground">{item.title}</p>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-4">
                        {!stage && (
                            <div className="rounded-lg border-2 border-primary/20 bg-zinc-950/60 backdrop-blur-md p-6 shadow-xl shadow-black/40 mb-8">
                                <p className="text-muted-foreground mb-4">{t('courses.lideranca-avancado.modules.stage.dante')}</p>
                                <div className="flex justify-center items-center gap-2">
                                    <Button 
                                        disabled={!isPurchased}
                                        onClick={() => {
                                            if (!isPurchased) return;
                                            stopAudio();
                                            setActiveStage(prev => ({...prev, [index]: 'dante'}));
                                            eventEmitter.emit('open-chat', { 
                                                context: 'dante-instrutor',
                                                data: {
                                                    courseContext: {
                                                      courseTitle: course.title,
                                                      moduleTitle: item.title,
                                                      danteLesson: item.danteLesson,
                                                      djenyLesson: item.djenyLesson
                                                    }
                                                }
                                            });
                                    }}>
                                        {t('courses.relacionamento-iniciante.modules.stage.ctaDante')} <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                            if (!isPurchased) return;
                                            if (playingId === danteAudioId) {
                                                stopAudio();
                                            } else {
                                                playAudio({
                                                    text: item.danteLesson[0].explanation,
                                                    voice: 'dante',
                                                    id: danteAudioId,
                                                });
                                            }
                                        }}
                                        disabled={(isLoadingAudio && playingId !== danteAudioId) || !isPurchased}
                                    >
                                        {isLoadingAudio && playingId === danteAudioId ? <Loader2 className="h-4 w-4 animate-spin" /> : (isPlaying && playingId === danteAudioId ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />)}
                                        <span className="sr-only">{t('courses.relacionamento-iniciante.modules.stage.listenPreview')}</span>
                                    </Button>
                                </div>
                                {!isPurchased && <p className="text-xs text-destructive mt-2">{t('courses.relacionamento-iniciante.modules.stage.purchasedRequired')}</p>}
                            </div>
                        )}

                        {(stage === 'dante' || stage === 'djeny') && (
                          <Card className="border-primary/50 bg-zinc-950/60 shadow-lg shadow-primary/10">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-lg text-primary"><Shield className="h-5 w-5"/> {t('excellence.dante.title')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground italic">"{item.danteLesson[0].explanation}"</p>
                            </CardContent>
                          </Card>
                        )}
                        
                        {stage === 'dante' && (
                            <div className="text-center py-4">
                                <div className="flex justify-center items-center gap-2">
                                    <Button 
                                        disabled={!isPurchased}
                                        onClick={() => {
                                            if (!isPurchased) return;
                                            stopAudio();
                                            setActiveStage(prev => ({...prev, [index]: 'djeny'}));
                                            eventEmitter.emit('open-chat', { 
                                                context: 'djeny-instrutor',
                                                data: {
                                                    courseContext: {
                                                      courseTitle: course.title,
                                                      moduleTitle: item.title,
                                                      danteLesson: item.danteLesson,
                                                      djenyLesson: item.djenyLesson
                                                    }
                                                }
                                            });
                                    }}>
                                        {t('courses.relacionamento-iniciante.modules.stage.ctaDjeny')} <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                            if (!isPurchased) return;
                                            if (playingId === djenyAudioId) {
                                                stopAudio();
                                            } else {
                                                playAudio({
                                                    text: item.djenyLesson[0].explanation,
                                                    voice: 'djeny',
                                                    id: djenyAudioId
                                                });
                                            }
                                        }}
                                        disabled={(isLoadingAudio && playingId !== djenyAudioId) || !isPurchased}
                                    >
                                        {isLoadingAudio && playingId === djenyAudioId ? <Loader2 className="h-4 w-4 animate-spin" /> : (isPlaying && playingId === djenyAudioId ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />)}
                                        <span className="sr-only">{t('courses.relacionamento-iniciante.modules.stage.listenPreview')}</span>
                                    </Button>
                                </div>
                            </div>
                        )}

                        {stage === 'djeny' && (
                            <Card className="border-emerald-500/50 bg-zinc-950/60 shadow-lg shadow-emerald-500/10 animate-in fade-in-50 duration-500">
                                <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg text-emerald-400"><Heart className="h-5 w-5"/> {t('excellence.djeny.title')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                <p className="text-sm text-emerald-100/80 italic">"{item.djenyLesson[0].explanation}"</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </AccordionContent>
              </AccordionItem>
            );
        })}
      </Accordion>

      <Card className="mt-8 text-center bg-zinc-950/60 backdrop-blur-md border-2 border-primary/20 shadow-xl shadow-black/40">
          <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center justify-center gap-2">
                  <Award className="h-6 w-6"/> {t('courses.lideranca-avancado.closing.title')}
              </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm prose-invert max-w-none text-muted-foreground space-y-4">
              <p><strong>Dante:</strong> "{t('courses.lideranca-avancado.closing.dante1')}"</p>
              <p><strong>Djeny:</strong> "{t('courses.lideranca-avancado.closing.djeny1')}"</p>
              <p><strong>Dante:</strong> "{t('courses.lideranca-avancado.closing.dante2')}"</p>
              <p><strong>Djeny:</strong> "{t('courses.lideranca-avancado.closing.djeny2')}"</p>
              <p className="font-bold text-lg text-primary">Dante & Djeny: "{t('courses.lideranca-avancado.closing.final')}"</p>
          </CardContent>
      </Card>
      
      <Card className="mt-6 text-center text-sm bg-zinc-950/60 border-2 border-primary/20 backdrop-blur-md p-4 shadow-xl shadow-black/40">
         <CardHeader className="p-2">
            <CardTitle className="flex items-center justify-center gap-2 text-primary font-headline tracking-widest">
                <Zap className="h-5 w-5" />
                {t('courses.lideranca-avancado.mentoria.title')}
            </CardTitle>
         </CardHeader>
         <CardContent className="p-2 text-muted-foreground">
            <p className="font-bold text-foreground">{t('courses.lideranca-avancado.mentoria.bonus')}</p>
            <ul className="mt-4 space-y-2 text-left">
                <li className="flex items-start gap-2"><span className="font-semibold text-primary/90">{t('courses.lideranca-avancado.mentoria.item1.title')}:</span> {t('courses.lideranca-avancado.mentoria.item1.desc')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-primary/90">{t('courses.lideranca-avancado.mentoria.item2.title')}:</span> {t('courses.lideranca-avancado.mentoria.item2.desc')}</li>
            </ul>
         </CardContent>
      </Card>
    </div>
  );
}
