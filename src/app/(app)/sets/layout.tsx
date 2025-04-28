import type { Metadata } from 'next'

import Layout from '@/components/layout'

export const metadata: Metadata = { title: 'Sets', description: 'Sets page' }

export default function SetsLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>
}
