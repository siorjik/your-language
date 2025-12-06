import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import Memorization from '@/components/activities/memorization'
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
    title: `${set.title} | Memorization`,
    description: `
      Train your memory with quizzes.
      Review terms, test recall, and track progress to boost long-term language retention.
    `,
  }
}

export default async function TestPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
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
    current: tActivities('memorization'),
  }

  return (
    <>
      <BreadcrumbWrap data={breadcrumbData} />
      <Memorization data={set} />
    </>
  )
}
