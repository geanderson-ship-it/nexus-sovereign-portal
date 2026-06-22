'use client';

import React, { useState, useEffect } from 'react';
import LiveLecturePlayer from '@/components/course-content/live-lecture-player';
import { useLocale } from '@/hooks/use-locale';

interface LiveLectureClientPageProps {
    course: any;
    slug: string;
}

export default function LiveLectureClientPage({ course, slug }: LiveLectureClientPageProps) {
    const { t } = useLocale();
    const [scriptChunks, setScriptChunks] = useState<{speaker: string, text: string}[]>([]);
    
    useEffect(() => {
        const chunks: {speaker: string, text: string}[] = [];
        let currentSpeaker = course.speakers?.[0]?.name || 'Dante'; // Default starts with first speaker

        for (let i = 0; i < 45; i++) {
            const chunkText = t(`lectures.scripts.${slug}.item${i}.text` as any);
            if (chunkText && !chunkText.includes(`lectures.scripts.${slug}`)) {
                const textLower = chunkText.toLowerCase();
                let assignedSpeaker = currentSpeaker;

                // Explicit introductions
                if (textLower.includes('olá, eu sou a djeny') || textLower.includes('olá, sou a djeny')) {
                    assignedSpeaker = 'Djeny';
                } else if (textLower.includes('olá, eu sou o dante') || textLower.includes('olá, sou o dante')) {
                    assignedSpeaker = 'Dante';
                } 
                // Addressing the other speaker at the start
                else if (textLower.startsWith('exatamente, djeny') || textLower.match(/^djeny[,. ]/i)) {
                    assignedSpeaker = 'Dante';
                } else if (textLower.startsWith('exatamente, dante') || textLower.match(/^dante[,. ]/i)) {
                    assignedSpeaker = 'Djeny';
                }
                // Handoff phrases within the chunk imply the CURRENT speaker is the OTHER person
                else if (textLower.includes('djeny, a palavra') || textLower.includes('com você, djeny') || textLower.includes('o que você acha, djeny') || textLower.includes('djeny, o que')) {
                    assignedSpeaker = 'Dante';
                } else if (textLower.includes('dante, a palavra') || textLower.includes('com você, dante') || textLower.includes('o que você acha, dante') || textLower.includes('dante, o que')) {
                    assignedSpeaker = 'Djeny';
                }

                chunks.push({ speaker: assignedSpeaker, text: chunkText });

                // Check for handoffs at the end of the text to change speaker for the NEXT chunk
                currentSpeaker = assignedSpeaker;
                if (textLower.includes('djeny, a palavra') || textLower.includes('com você, djeny') || textLower.includes('o que você acha, djeny') || textLower.includes('djeny, o que')) {
                    currentSpeaker = 'Djeny';
                } else if (textLower.includes('dante, a palavra') || textLower.includes('com você, dante') || textLower.includes('o que você acha, dante') || textLower.includes('dante, o que')) {
                    currentSpeaker = 'Dante';
                }
            }
        }
        setScriptChunks(chunks);
    }, [slug, t, course.speakers]);

    return (
        <div className="min-h-screen bg-black flex flex-col pt-20">
            <div className="container mx-auto py-8 flex-1 flex flex-col">
                <div className="mb-8">
                    <h1 className="text-3xl font-headline font-bold text-white mb-2">{course.title}</h1>
                    <p className="text-zinc-400">{course.subtitle || 'Apresentação Interativa'}</p>
                </div>
                
                <div className="flex-1">
                    <LiveLecturePlayer 
                        course={course}
                        scriptChunks={scriptChunks}
                        speakers={course.speakers || []}
                    />
                </div>
            </div>
        </div>
    );
}
