import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
    }

    // Provision an ephemeral token for Gemini Live
    // Note: This requires the latest @google/generative-ai SDK.
    // If it fails, we fall back to direct key usage for this dev-only mode.
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // @ts-ignore - Some older type definitions might not have authTokens yet
      if (genAI.authTokens && typeof genAI.authTokens.create === 'function') {
        const token = await (genAI as any).authTokens.create({
          config: {
            uses: 1,
            expireTime: new Date(Date.now() + 30 * 60 * 1000).toISOString()
          }
        });
        return NextResponse.json({ token: token.name });
      }
    } catch (e) {
      console.warn("VIX: Ephemeral token provisioning not supported by current SDK. Using direct key for proxy.", e);
    }

    // Fallback: For local dev only, provide a way to connect. 
    // In production, you would ALWAYS proxy or use ephemeral tokens.
    return NextResponse.json({ key: apiKey });
  } catch (error: any) {
    console.error("Gemini Live Token Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
