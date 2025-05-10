import { notFound } from 'next/navigation'
import Link from 'next/link'

import SetForm from '@/components/forms/set-form'
import { Button } from '@/components/ui/button'
import BreadcrumbWrap from '@/components/breadcrumb-wrap'

import { getSetById } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { Set } from '@prisma/client'
import { getUpdateSetAppPath, setAppPath } from '@/utils/paths'

export default async function SetData({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const set: (Set & { error: null }) | Err = await getSetById(id)

  if (set.error) notFound()

  const breadcrumbData = { links: [{ href: setAppPath, label: 'sets' }], current: set.title }

  return (
    <>
      <BreadcrumbWrap data={breadcrumbData} />
      <Button className="mb-5" asChild>
        <Link href={getUpdateSetAppPath(id)}>Update</Link>
      </Button>
      <SetForm data={{ ...set, list: set.list as { term: string; definition: string }[] }} />
    </>
  )
}
