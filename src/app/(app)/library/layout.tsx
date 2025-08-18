import type { Metadata } from 'next'

import Layout from '@/components/layout'

export const metadata: Metadata = {
  title: 'Library | Language Bro',
  description: 'Open library with powerful instruments to learn a language.',
}

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>
}
