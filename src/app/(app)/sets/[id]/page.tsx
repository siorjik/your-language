import { notFound } from 'next/navigation'

import SetForm from '@/components/forms/set-form'
import BreadcrumbWrap from '@/components/breadcrumb-wrap'
import NavPanel from './_components/nav-panel'

import { getSetById } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { Set } from '@prisma/client'
import { setsAppPath } from '@/utils/paths'
import { SetList } from '@/types/models/set'

export default async function SetData({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const set: (Set & { error: null }) | Err = await getSetById(id)

  if (set.error) notFound()

  const breadcrumbData = { links: [{ href: setsAppPath, label: 'sets' }], current: set.title }

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
