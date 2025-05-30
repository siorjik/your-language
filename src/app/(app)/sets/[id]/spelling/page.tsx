import { notFound } from 'next/navigation'

import Spelling from './_components/spelling'
import BreadcrumbWrap from '@/components/breadcrumb-wrap'

import { getSetById } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { Set } from '@prisma/client'
import { getSetAppPath, setAppPath } from '@/utils/paths'

export default async function SpellingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const set: (Set & { error: null }) | Err = await getSetById(id)

  if (set.error) notFound()

  const breadcrumbData = {
    links: [
      { href: setAppPath, label: 'sets' },
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
