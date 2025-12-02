import { notFound } from 'next/navigation'

import BreadcrumbWrap from '@/components/breadcrumb-wrap'
import Associations from '@/components/activities/associations'

import { getSetById } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { getSetAppPath, libraryAppPath, setsAppPath } from '@/utils/paths'
import { SelectedSet } from '@/types/models/set'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const set: (SelectedSet & { error: null }) | Err = await getSetById(id)

  if (set.error) notFound()

  return {
    title: `${set.title} | Associations`,
    description: `
      Discover and create powerful associations for every word.
      Use contextual hints to make learning new vocabulary faster and easier.
    `,
  }
}

export default async function AssociationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const set: (SelectedSet & { error: null }) | Err = await getSetById(id)

  if (set.error) notFound()

  const breadcrumbData = {
    links: [
      { href: libraryAppPath, label: 'Library' },
      { href: setsAppPath, label: 'Sets' },
      { href: getSetAppPath(set.id), label: `${set.title}` },
    ],
    current: 'Associations',
  }

  return (
    <>
      <BreadcrumbWrap data={breadcrumbData} />
      <Associations data={set} />
    </>
  )
}
