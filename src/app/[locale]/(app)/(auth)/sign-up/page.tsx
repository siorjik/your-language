import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import SignUpForm from '@/components/forms/sign-up-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Sign Up | Language Bro',
  description: `
    Create your free Language Bro account and start learning
    languages with flashcards, progress tracking, and personalized practice.
  `,
}

export default async function SignUp() {
  const t = await getTranslations('common')

  return (
    <Card className="max-w-[450px] w-[100%] py-5 md:px-5 border-transparent bg-secondary/10 shadow-xl">
      <CardHeader>
        <CardTitle className="text-center text-primary">{t('signUp')}</CardTitle>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
    </Card>
  )
}
