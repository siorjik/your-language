import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'f005.backblazeb2.com' },
      { protocol: 'https', hostname: 'your-language.s3.eu-north-1.amazonaws.com' }
    ]
  }
}

export default nextConfig
