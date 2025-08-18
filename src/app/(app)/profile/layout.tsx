import type { Metadata } from 'next'

import Layout from '@/components/layout'

export const metadata: Metadata = { title: 'Profile | Language Bro', description: 'Update your account data.' }

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>
}
