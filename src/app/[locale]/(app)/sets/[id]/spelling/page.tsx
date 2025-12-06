import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import Spelling from '@/components/activities/spelling'
import BreadcrumbWrap from '@/components/breadcrumb-wrap'

import { getSetById } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { getSetAppPath, libraryAppPath, setsAppPath } from '@/utils/paths'
import { SelectedSet } from '@/types/models/set'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const set: (SelectedSet & { error: null }) | Err = await getSetById(id)

  if (set.error) notFound()

  return {
    title: `${set.title} | Spelling`,
    description: `
      Improve spelling and vocabulary accuracy with interactive practice.
      Type answers, test recall, and reinforce correct language usage.
    `,
  }
}

export default async function SpellingPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params

  const t = await getTranslations({ locale, namespace: 'menu' })
  const tActivities = await getTranslations({ locale, namespace: 'activities' })

  const set: (SelectedSet & { error: null }) | Err = await getSetById(id)

  if (set.error) notFound()

  const breadcrumbData = {
    links: [
      { href: libraryAppPath, label: t('library') },
      { href: setsAppPath, label: t('sets') },
      { href: getSetAppPath(set.id), label: `${set.title}` },
    ],
    current: tActivities('spelling'),
  }

  return (
    <>
      <BreadcrumbWrap data={breadcrumbData} />
      <Spelling data={set} />
    </>
  )
}
