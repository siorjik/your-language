import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import LoginForm from './_components/login-form'

export const metadata: Metadata = {
  title: 'Sign In | Language Bro',
  description: 'Access your Language Bro account to continue learning with flashcards, quizzes, and progress tracking.',
}

export default async function SignIn() {
  const t = await getTranslations('common')

  return (
    <Card className="max-w-[450px] w-[100%] py-5 md:px-5 border-transparent bg-secondary/10 shadow-xl">
      <CardHeader>
        <CardTitle className="text-center text-primary">{t('signIn')}</CardTitle>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  )
}
