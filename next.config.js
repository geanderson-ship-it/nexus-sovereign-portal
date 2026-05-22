/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
      '@genkit-ai/ai'
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
  disable: process.env.NODE_ENV === 'development', // Opcional: Desabilita em dev para evitar spam no console
  workboxOptions: {
    disableDevLogs: true,
  },
});

module.exports = withPWA(nextConfig);