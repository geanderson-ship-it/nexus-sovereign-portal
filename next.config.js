const nextConfig = {
  reactStrictMode: true,
  env: {
    AMPLIFY_ACCESS_KEY_ID: process.env.AMPLIFY_ACCESS_KEY_ID,
    AMPLIFY_SECRET_ACCESS_KEY: process.env.AMPLIFY_SECRET_ACCESS_KEY,
    AMPLIFY_REGION: process.env.AMPLIFY_REGION,
    BEDROCK_ACCESS_KEY_ID: process.env.BEDROCK_ACCESS_KEY_ID,
    BEDROCK_SECRET_ACCESS_KEY: process.env.BEDROCK_SECRET_ACCESS_KEY,
    BEDROCK_REGION: process.env.BEDROCK_REGION,
    NEXUS_ACCESS_KEY_ID: process.env.NEXUS_ACCESS_KEY_ID,
    NEXUS_SECRET_ACCESS_KEY: process.env.NEXUS_SECRET_ACCESS_KEY,
    NEXUS_REGION: process.env.NEXUS_REGION,
    MOCK_AI: process.env.MOCK_AI,
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
    DANTE_ELEVENLABS_VOICE_ID: process.env.DANTE_ELEVENLABS_VOICE_ID,
    ATENA_ELEVENLABS_VOICE_ID: process.env.ATENA_ELEVENLABS_VOICE_ID,
    ORION_ELEVENLABS_VOICE_ID: process.env.ORION_ELEVENLABS_VOICE_ID,
    NEXUS_TRANSCRIBE_BUCKET: process.env.NEXUS_TRANSCRIBE_BUCKET,
  },
  images: {
    // Platinum Optimization: AWS Amplify handles image optimization natively via CloudFront.
    remotePatterns: [
      { protocol: 'https', hostname: 'i.postimg.cc' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
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