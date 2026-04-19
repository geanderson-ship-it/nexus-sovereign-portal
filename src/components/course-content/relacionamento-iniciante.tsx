
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
import { errorEmitter } from '@/firebase/error-emitter';
import type { Course } from '@/lib/courses-data';
import { useNexusAudio } from '@/hooks/use-nexus-audio';
import { useLocale } from '@/hooks/use-locale';

export default function RelacionamentoInicianteContent({ course, isPurchased }: { course: Course; isPurchased: boolean }) {
  const [activeStage, setActiveStage] = useState<Record<number, 'dante' | 'djeny'>>({});
  const { playAudio, stopAudio, isPlaying, isLoadingAudio, playingId } = useNexusAudio();
  const { t, tObject } = useLocale();

  const courseData = tObject<any[]>('courses.relacionamento-iniciante.data') || [];
  
  return (
    <div className="space-y-8">
        <div className="text-left mb-8 prose prose-sm prose-invert max-w-none text-foreground space-y-6">
            <h2 className="text-2xl font-bold text-primary font-headline">{t('courses.relacionamento-iniciante.title')}</h2>
            
            <div>
                <h3 className="font-bold text-lg text-primary">{t('courses.relacionamento-iniciante.section1.title')}</h3>
                <p><strong>Dante:</strong> "{t('courses.relacionamento-iniciante.section1.dante')}"</p>
                <p><strong>Djeny:</strong> "{t('courses.relacionamento-iniciante.section1.djeny')}"</p>
            </div>

            <div>
                <h3 className="font-bold text-lg text-primary">{t('courses.relacionamento-iniciante.section2.title')}</h3>
                <p><strong>Dante:</strong> "{t('courses.relacionamento-iniciante.section2.dante')}"</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>{t('courses.relacionamento-iniciante.section2.item1.title')}:</strong> {t('courses.relacionamento-iniciante.section2.item1.desc')}</li>
                    <li><strong>{t('courses.relacionamento-iniciante.section2.item2.title')}:</strong> {t('courses.relacionamento-iniciante.section2.item2.desc')}</li>
                    <li><strong>{t('courses.relacionamento-iniciante.section2.item3.title')}:</strong> {t('courses.relacionamento-iniciante.section2.item3.desc')}</li>
                    <li><strong>{t('courses.relacionamento-iniciante.section2.item4.title')}:</strong> {t('courses.relacionamento-iniciante.section2.item4.desc')}</li>
                </ul>
            </div>
            
            <div>
                <h3 className="font-bold text-lg text-primary">{t('courses.relacionamento-iniciante.section3.title')}</h3>
                <p><strong>Dante (O Aço):</strong> "{t('courses.relacionamento-iniciante.section3.danteAco')}"</p>
                <p><strong>Djeny (A Seda):</strong> "{t('courses.relacionamento-iniciante.section3.djenySeda')}"</p>
                <p><strong>Dante:</strong> "{t('courses.relacionamento-iniciante.section3.danteBalance')}"</p>
                <p><strong>Djeny:</strong> "{t('courses.relacionamento-iniciante.section3.djenyBalance')}"</p>
            </div>

            <div>
                <h3 className="font-bold text-lg text-primary">{t('courses.relacionamento-iniciante.section4.title')}</h3>
                <p><strong>Dante:</strong> "{t('courses.relacionamento-iniciante.section4.dante')}"</p>
                <p><strong>Djeny:</strong> "{t('courses.relacionamento-iniciante.section4.djeny')}"</p>
            </div>
        </div>

      <Accordion type="single" collapsible className="w-full">
        {courseData.map((item: any, index: number) => {
            const stage = activeStage[index];
            const danteAudioId = `dante-iniciante-${index}`;
            const djenyAudioId = `djeny-iniciante-${index}`;

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
                                <p className="text-muted-foreground mb-4">{t('courses.relacionamento-iniciante.modules.stage.dante')}</p>
                                <div className="flex justify-center items-center gap-2">
                                    <Button 
                                        disabled={!isPurchased}
                                        onClick={() => {
                                            if (!isPurchased) return;
                                            stopAudio();
                                            setActiveStage(prev => ({...prev, [index]: 'dante'}));
                                            errorEmitter.emit('open-chat', { 
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
                          <Card className="border-gray-500/50 bg-secondary/50">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-lg text-gray-300"><Shield className="h-5 w-5"/> {t('excellence.dante.title')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-400 italic">"{item.danteLesson[0].explanation}"</p>
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
                                            errorEmitter.emit('open-chat', { 
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
                                                    id: djenyAudioId,
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
                            <Card className="border-2 border-purple-500/30 bg-zinc-950/60 backdrop-blur-md animate-in fade-in-50 duration-500 shadow-xl shadow-purple-500/5">
                                <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg text-purple-400"><Heart className="h-5 w-5"/> {t('excellence.djeny.title')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                <p className="text-sm text-purple-100/80 italic">"{item.djenyLesson[0].explanation}"</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </AccordionContent>
              </AccordionItem>
            );
        })}
      </Accordion>
      
      <Card className="mt-8 text-center bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30 shadow-lg">
          <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center justify-center gap-2">
                  <Award className="h-6 w-6"/> {t('courses.relacionamento-iniciante.closing.title')}
              </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm prose-invert max-w-none text-muted-foreground space-y-4">
              <p><strong>Dante:</strong> "{t('courses.relacionamento-iniciante.closing.dante1')}"</p>
              <p><strong>Djeny:</strong> "{t('courses.relacionamento-iniciante.closing.djeny1')}"</p>
              <p><strong>Dante:</strong> "{t('courses.relacionamento-iniciante.closing.dante2')}"</p>
              <p><strong>Djeny:</strong> "{t('courses.relacionamento-iniciante.closing.djeny2')}"</p>
              <p className="font-bold text-lg text-primary">Dante & Djeny: "{t('courses.relacionamento-iniciante.closing.final')}"</p>
          </CardContent>
      </Card>
    </div>
  );
}

    
