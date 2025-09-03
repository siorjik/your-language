import type { Metadata } from 'next'

import Layout from '@/components/layout'

export const metadata: Metadata = { title: 'Users | Language Bro', description: 'Users page' }

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>
}
