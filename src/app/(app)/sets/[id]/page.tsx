import { notFound, redirect } from 'next/navigation'

import SetForm from '@/components/forms/set-form'
import BreadcrumbWrap from '@/components/breadcrumb-wrap'
import NavPanel from './_components/nav-panel'

import { getSetById } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { getSetAppPath, libraryAppPath, setsAppPath } from '@/utils/paths'
import { SelectedSet } from '@/types/models/set'

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ owner?: string }>
}) {
  const { id } = await params
  const { owner } = await searchParams

  if (!owner) {
    const set: (SelectedSet & { error: null }) | Err = await getSetById(id)

    if (set.error) notFound()

    return { title: `${set.title} | Language Bro`, description: 'Review your current Set and make some changes if it needed.' }
  }
  return null
}

export default async function SetData({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ owner?: string }>
}) {
  const { id } = await params
  const { owner } = await searchParams

  const set: (SelectedSet & { error: null }) | Err = await getSetById(id, owner)

  if (set && owner && !set.error) redirect(getSetAppPath(set.id))

  if (set.error) notFound()

  const breadcrumbData = {
    links: [
      { href: libraryAppPath, label: 'Library' },
      { href: setsAppPath, label: 'Sets' },
    ],
    current: set.title,
  }

  return (
    <>
      <BreadcrumbWrap data={breadcrumbData} />
      <div className="mb-8">
        <NavPanel id={id} isOwnerExist={!!set.ownerId} />
      </div>
      <SetForm data={{ ...set, list: set.list }} />
    </>
  )
}
