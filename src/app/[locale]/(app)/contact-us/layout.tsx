import type { Metadata } from 'next'

import Layout from '@/components/layout'

export const metadata: Metadata = {
  title: 'Contact Us | Language Bro',
  description: 'Contact us if you have any issues or propositions.',
}

export default function ContactUsLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>
}
