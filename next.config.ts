import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  output: 'standalone',
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

const withNextIntl = createNextIntlPlugin('./i18n.ts')

export default withNextIntl(nextConfig)
