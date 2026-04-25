
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { getCourseBySlug, Course } from '@/lib/courses-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNexusAudio } from '@/hooks/use-nexus-audio';
import { Volume2, Pause, Loader2, Play, ArrowLeft, BotMessageSquare, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { lectureScripts, LectureScriptItem } from '@/lib/lecture-scripts';
import { useUser, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { isAdminUser } from '@/lib/constants';
import { palestras as allPalestras } from '@/lib/courses-data';
import { useLocale } from '@/hooks/use-locale';

export default function ClientPage({ params: routeParams }: { params: { slug: string } }) {
    const { t } = useLocale();
    const routerParams = useParams();
    const slug = routeParams?.slug || routerParams?.slug as string;
    
    if (!slug) return null;

    const course = getCourseBySlug(slug) as Course | undefined;
    const lectureScript = lectureScripts[slug];
    
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const purchasesQuery = useMemoFirebase(() => {
        if (!user?.uid || !firestore) return null;
        return query(collection(firestore, 'users', user.uid, 'purchases'), where('courseId', '==', slug));
    }, [user?.uid, firestore, slug]);

    const { data: purchases, isLoading: purchasesLoading } = useCollection<any>(purchasesQuery);
    
    const isAdmin = isAdminUser(user);
    const isPurchased = (purchases ? purchases.length > 0 : false) || isAdmin;

    const { playAudio, stopAudio, isPlaying, isLoadingAudio, playingId } = useNexusAudio();
    const [isPlaylistActive, setIsPlaylistActive] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);

    const isPlaylistActiveRef = useRef(isPlaylistActive);
    useEffect(() => {
        isPlaylistActiveRef.current = isPlaylistActive;
    }, [isPlaylistActive]);

    const playTrack = useCallback((index: number) => {
        if (!lectureScript || index >= lectureScript.length || !isPurchased) {
            setIsPlaylistActive(false);
            setCurrentTrackIndex(null);
            return;
        }
        setCurrentTrackIndex(index);
        const track = lectureScript[index];

        if (!track.text) {
             // Skip non-playable sections and move to the next
            playTrack(index + 1);
            return;
        }

        playAudio({
            text: t(track.text as any),
            voice: track.speaker as 'dante' | 'djeny',
            id: index,
            audioUrl: track.audioUrl,
            onEnded: () => {
                if (isPlaylistActiveRef.current) {
                    playTrack(index + 1);
                }
            },
        });
    }, [playAudio, lectureScript]); // eslint-disable-line react-hooks/exhaustive-deps


    const handlePlayAllToggle = () => {
        if (isPlaylistActive) {
            stopAudio();
            setIsPlaylistActive(false);
            setCurrentTrackIndex(null);
        } else {
            setIsPlaylistActive(true);
            playTrack(0);
        }
    };
    
    useEffect(() => {
        // Cleanup function to stop audio when the component unmounts
        return () => {
            stopAudio();
        };
    }, [stopAudio]);

    if (!course || course.type !== 'palestra' || !lectureScript) {
        notFound();
    }
    
    return (
        <div className="bg-black text-white min-h-screen">
            <div className="container mx-auto py-12">
                <div className="mb-8">
                     <Button asChild variant="outline">
                        <Link href="/palestras">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t('lectures.preview.back')}
                        </Link>
                    </Button>
                </div>
                <Card className="bg-gray-900/50 border-primary/30">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-3xl text-primary">{t(`palestras.${slug}.title` as any) || course.title}</CardTitle>
                        <CardDescription>{t('lectures.preview.subtitle')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isUserLoading || purchasesLoading ? (
                             <div className="space-y-4">
                                <Skeleton className="h-64 w-full rounded-lg" />
                                <div className="flex justify-center">
                                    <Skeleton className="h-10 w-48" />
                                </div>
                                <Skeleton className="h-64 w-full rounded-lg" />
                             </div>
                        ) : !isPurchased ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
                                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Lock className="h-12 w-12 text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold font-headline">{t('lectures.preview.restricted.title')}</h3>
                                    <p className="text-muted-foreground max-w-md mx-auto">
                                        {t('lectures.preview.restricted.description')}
                                    </p>
                                </div>
                                <Button asChild size="lg">
                                    <Link href={`/courses/${slug}`}>
                                        {t('lectures.preview.restricted.cta')}
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="relative h-64 w-full max-w-4xl mx-auto rounded-lg overflow-hidden bg-black flex items-center justify-center p-4 border border-primary/20">
                                    <div className="absolute inset-0 z-0">
                                        <Image 
                                            src={course.image.src}
                                            alt={course.image.alt || "Palco da palestra"}
                                            fill
                                            sizes="100vw"
                                            style={{ objectFit: 'cover' }}
                                            className="opacity-90"
                                            quality={100}
                                        />
                                    </div>
                                </div>

                                <div className="text-center my-6">
                                    <Button onClick={handlePlayAllToggle} size="lg" disabled={isLoadingAudio}>
                                        {isLoadingAudio ? (
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        ) : isPlaylistActive ? (
                                            <Pause className="mr-2 h-5 w-5" />
                                        ) : (
                                            <Play className="mr-2 h-5 w-5" />
                                        )}
                                        {isLoadingAudio ? t('lectures.preview.loading') : isPlaylistActive ? t('lectures.preview.pause') : t('lectures.preview.play')}
                                    </Button>
                                </div>

                                <ScrollArea className="h-[400px] mt-4 p-4 border rounded-lg border-secondary">
                                    <div className="space-y-6">
                                        {lectureScript.map((line, index) => {
                                            const isCurrentlyPlaying = playingId === index;
                                            const translatedText = t(line.text as any);
                                            const translatedQuestion = line.question ? t(line.question as any) : undefined;
                                            
                                            return (
                                                <div key={index} className={cn("flex items-start gap-4 p-3 rounded-lg transition-all", isCurrentlyPlaying && "bg-primary/10")}>
                                                    <div className="flex-1 space-y-2">
                                                        {translatedQuestion && (
                                                            <p className="text-sm italic text-muted-foreground flex gap-2 items-center"><BotMessageSquare className="h-4 w-4 shrink-0" /> {translatedQuestion}</p>
                                                        )}
                                                        <p className="text-gray-300 leading-relaxed">{translatedText}</p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </ScrollArea>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
