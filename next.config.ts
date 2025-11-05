import type { NextConfig } from 'next'
import withPWA from 'next-pwa'

const isProd = process.env.NODE_ENV === 'production'

const withPWAConfig = withPWA({ dest: 'public', register: true, skipWaiting: true, disable: !isProd })

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'f005.backblazeb2.com' },
      { protocol: 'https', hostname: 'your-language.s3.eu-north-1.amazonaws.com' }
    ]
  }
}

export default withPWAConfig(nextConfig)
