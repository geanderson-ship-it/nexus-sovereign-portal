const nextConfig = {
  reactStrictMode: true,
  env: {
    AMPLIFY_ACCESS_KEY_ID: process.env.AMPLIFY_ACCESS_KEY_ID,
    AMPLIFY_SECRET_ACCESS_KEY: process.env.AMPLIFY_SECRET_ACCESS_KEY,
    AMPLIFY_REGION: process.env.AMPLIFY_REGION,
    BEDROCK_ACCESS_KEY_ID: process.env.BEDROCK_ACCESS_KEY_ID,
    BEDROCK_SECRET_ACCESS_KEY: process.env.BEDROCK_SECRET_ACCESS_KEY,
    BEDROCK_REGION: process.env.BEDROCK_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    NEXUS_ACCESS_KEY_ID: process.env.NEXUS_ACCESS_KEY_ID,
    NEXUS_SECRET_ACCESS_KEY: process.env.NEXUS_SECRET_ACCESS_KEY,
    NEXUS_REGION: process.env.NEXUS_REGION,
    MOCK_AI: process.env.MOCK_AI,
    AZURE_SPEECH_KEY: process.env.AZURE_SPEECH_KEY,
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
    DANTE_ELEVENLABS_VOICE_ID: process.env.DANTE_ELEVENLABS_VOICE_ID,
    ATENA_ELEVENLABS_VOICE_ID: process.env.ATENA_ELEVENLABS_VOICE_ID,
    EVOLUTION_API_URL: process.env.EVOLUTION_API_URL,
    EVOLUTION_GLOBAL_APIKEY: process.env.EVOLUTION_GLOBAL_APIKEY,
    EVOLUTION_INSTANCE_NAME: process.env.EVOLUTION_INSTANCE_NAME,
    ORION_ELEVENLABS_VOICE_ID: process.env.ORION_ELEVENLABS_VOICE_ID,
    NEXUS_TRANSCRIBE_BUCKET: process.env.NEXUS_TRANSCRIBE_BUCKET,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    ZAPI_INSTANCE: process.env.ZAPI_INSTANCE,
    ZAPI_TOKEN: process.env.ZAPI_TOKEN,
    ZAPI_CLIENT_TOKEN: process.env.ZAPI_CLIENT_TOKEN,
    GMAIL_PESSOAL_EMAIL: process.env.GMAIL_PESSOAL_EMAIL,
    GMAIL_PESSOAL_PASS: process.env.GMAIL_PESSOAL_PASS,
    GMAIL_EMPRESA_EMAIL: process.env.GMAIL_EMPRESA_EMAIL,
    GMAIL_EMPRESA_PASS: process.env.GMAIL_EMPRESA_PASS,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD,
    GEANDERSON_WHATSAPP_PHONE: process.env.GEANDERSON_WHATSAPP_PHONE,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  images: {
    // Platinum Optimization: AWS Amplify handles image optimization natively via CloudFront.
    remotePatterns: [
      { protocol: 'https', hostname: 'i.postimg.cc' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' }
    ],
  },
  typescript: {
    ignoreBuildErrors: true, 
  },
  eslint: {
    ignoreDuringBuilds: true, 
  },
  experimental: {
    serverComponentsExternalPackages: [
      'genkit',
      'genkitx-aws-bedrock',
      '@genkit-ai/core',
      '@genkit-ai/ai',
      'yt-search',
      'cheerio'
    ],
  },
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/intelligence/dante%20builder',
        destination: '/intelligence/dante-builder',
        permanent: true,
      },
    ]
  },
}

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: false, // Alterado para false para testar a instalação no npm run dev
  workboxOptions: {
    disableDevLogs: true,
  },
});

module.exports = withPWA(nextConfig);