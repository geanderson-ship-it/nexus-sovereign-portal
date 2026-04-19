/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
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
      '@genkit-ai/google-genai',
      '@genkit-ai/core',
      '@genkit-ai/ai',
      '@google/generative-ai'
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

module.exports = nextConfig