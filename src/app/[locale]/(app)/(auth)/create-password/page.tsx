import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CreatePassword from './_components/create-password-form'

export const metadata: Metadata = {
  title: 'Password Creation | Language Bro',
  description: 'Set a secure password to protect your Language Bro account and continue your language learning journey.',
  robots: { index: false, follow: false },
}

export default async function CreatePasswordPage({ searchParams }: { searchParams: Promise<{ token: string }> }) {
  const { token } = await searchParams

  const t = await getTranslations('form')

  return (
    <Card className="max-w-[450px] w-[100%] py-5 md:px-5 border-transparent bg-secondary/10 shadow-xl">
      <CardHeader>
        <CardTitle className="text-center text-primary">{t('passCreation')}</CardTitle>
      </CardHeader>
      <CardContent>
        <CreatePassword token={token} />
      </CardContent>
    </Card>
  )
}
