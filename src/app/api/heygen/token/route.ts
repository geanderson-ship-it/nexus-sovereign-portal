import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
        
        if (!HEYGEN_API_KEY) {
            return NextResponse.json({ error: 'API key not configured' }, { status: 501 });
        }

        const res = await fetch('https://api.heygen.com/v1/streaming.create_token', {
            method: 'POST',
            headers: {
                'x-api-key': HEYGEN_API_KEY
            }
        });

        if (!res.ok) {
            throw new Error(`Failed to create token: ${res.statusText}`);
        }

        const data = await res.json();
        return NextResponse.json({ token: data.data.token });

    } catch (error) {
        console.error('Error generating HeyGen token:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
