import type { Metadata } from 'next'

import Layout from '@/components/layout'

export const metadata: Metadata = {
  title: 'Sets | Language Bro',
  description: `Create new sets and train with current ones to expand your vocabulary with new words and
    improve your memorization with flashcards, quizzes and spelling.`,
}

export default function SetsLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>
}
