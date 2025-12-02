import type { Metadata } from 'next'

import Layout from '@/components/layout'

export const metadata: Metadata = {
  title: 'Activities | Language Bro',
  description: 'Train your language skills with flashcards, quizzes and another activities',
}

export default function ActivitiesLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>
}
