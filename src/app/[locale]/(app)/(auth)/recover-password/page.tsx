import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import RecoverPassword from './_components/recover-password-form'

export const metadata: Metadata = {
  title: 'Password Recovery | Language Bro',
  description: 'Recover access to your Language Bro account by resetting your password.',
  robots: { index: false, follow: false },
}

export default async function RecoverPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ locale: string; token: string }>
}) {
  const { token } = await searchParams

  const t = await getTranslations('form')

  return (
    <Card className="max-w-[450px] w-[100%] py-5 md:px-5 border-transparent bg-secondary/10 shadow-xl">
      <CardHeader>
        <CardTitle className="text-center text-primary">{t('passRecovery')}</CardTitle>
      </CardHeader>
      <CardContent>
        <RecoverPassword token={token} />
      </CardContent>
    </Card>
  )
}
