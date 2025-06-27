import type { Metadata } from 'next'

import Layout from '@/components/layout'

export const metadata: Metadata = { title: 'Activities', description: 'Activities page' }

export default function ActivitiesLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>
}
