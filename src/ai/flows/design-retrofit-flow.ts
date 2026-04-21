
'use server';
/**
 * @fileOverview A WaMÃ³vel design retrofit AI agent.
 *
 * - generateRetrofitImage - A function that generates a new image based on an original and a text prompt.
 */

import { ai } from '@/ai/genkit';
import { type RetrofitInput, type RetrofitOutput } from './design-retrofit-types';

export async function generateRetrofitImage(input: RetrofitInput): Promise<RetrofitOutput> {
    const { media } = await ai.generate({
        model: 'aws-bedrock/anthropic.claude-3-sonnet-20240229-v1:0',
        prompt: [
            { media: { url: input.photoDataUri } },
            { text: input.prompt },
        ],
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
            temperature: 0.4,
            topP: 1,
            maxOutputTokens: 8192,
            safetySettings: [
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
            ],
        },
    });

    if (!media?.url) {
        throw new Error('Image generation failed to return an image.');
    }

    return { imageUri: media.url };
}

