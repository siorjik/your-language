import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import Link from '@/components/link'
import SetForm from '@/components/forms/set-form'
import { Button } from '@/components/ui/button'

import { setsAppPath } from '@/utils/paths'

export const metadata: Metadata = {
  title: 'New Set Creation | Language Bro',
  description: `Create new sets to expand your vocabulary with new words and
    improve your memorization with flashcards, quizzes and spelling.`,
}

export default async function NewSet() {
  const t = await getTranslations('Sets.creationPage')

  return (
    <>
      <Button className="mb-8" asChild>
        <Link href={setsAppPath}>{t('cancel')}</Link>
      </Button>
      <h2 className="sub-title-1">{t('title')}</h2>
      <SetForm action="create" />
    </>
  )
}
