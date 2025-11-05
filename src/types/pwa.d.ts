declare module 'next-pwa' {
  import type { NextConfig } from 'next'

  export interface PWAConfig {
    dest?: string
    disable?: boolean
    register?: boolean
    skipWaiting?: boolean
    // runtimeCaching?: any[];
    buildExcludes?: string[]
    publicExcludes?: string[]
    cacheStartUrl?: boolean
  }

  export default function withPWA(options?: PWAConfig): (nextConfig: NextConfig) => NextConfig
}
