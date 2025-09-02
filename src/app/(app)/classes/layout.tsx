import type { Metadata } from 'next'

import Layout from '@/components/layout'

export const metadata: Metadata = {
  title: 'Classes | Language Bro',
  description: 'Join classes and create new ones for more productive study.',
}

export default function ClassesLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>
}
