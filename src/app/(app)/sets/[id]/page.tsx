import { notFound } from 'next/navigation'

import SetForm from '@/components/forms/set-form'
import BreadcrumbWrap from '@/components/breadcrumb-wrap'
import NavPanel from './_components/nav-panel'

import { getSetById } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { Set } from '@prisma/client'
import { libraryAppPath, setsAppPath } from '@/utils/paths'
import { SetList } from '@/types/models/set'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const set: (Set & { error: null }) | Err = await getSetById(id)

  if (set.error) notFound()

  return { title: `Set: ${set.title}`, description: `${set.title} page` }
}

export default async function SetData({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const set: (Set & { error: null }) | Err = await getSetById(id)

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
        <NavPanel id={id} />
      </div>
      <SetForm data={{ ...set, list: set.list as SetList }} />
    </>
  )
}
