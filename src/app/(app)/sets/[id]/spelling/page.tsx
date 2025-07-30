import { notFound } from 'next/navigation'

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

  return { title: `${set.title} (spelling)`, description: `${set.title} (spelling) page` }
}

export default async function SpellingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const set: (SelectedSet & { error: null }) | Err = await getSetById(id)

  if (set.error) notFound()

  const breadcrumbData = {
    links: [
      { href: libraryAppPath, label: 'Library' },
      { href: setsAppPath, label: 'Sets' },
      { href: getSetAppPath(set.id), label: `${set.title}` },
    ],
    current: 'spelling',
  }

  return (
    <>
      <BreadcrumbWrap data={breadcrumbData} />
      <Spelling data={set} />
    </>
  )
}
