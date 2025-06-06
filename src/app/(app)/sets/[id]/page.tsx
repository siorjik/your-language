import { notFound } from 'next/navigation'
import { FileCog } from 'lucide-react'
import Link from 'next/link'

import SetForm from '@/components/forms/set-form'
import BreadcrumbWrap from '@/components/breadcrumb-wrap'
import NavPanel from './_components/nav-panel'

import { getSetById } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { Set } from '@prisma/client'
import { getUpdateSetAppPath, setAppPath } from '@/utils/paths'
import { SetList } from '@/types/models/set'
import { Button } from '@/components/ui/button'

export default async function SetData({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const set: (Set & { error: null }) | Err = await getSetById(id)

  if (set.error) notFound()

  const breadcrumbData = { links: [{ href: setAppPath, label: 'sets' }], current: set.title }

  return (
    <>
      <BreadcrumbWrap data={breadcrumbData} />
      <div className="mb-8 flex justify-between">
        <Button asChild>
          <Link href={getUpdateSetAppPath(id)}>
            <FileCog />
            Update
          </Link>
        </Button>
        <NavPanel id={id} />
      </div>
      <SetForm data={{ ...set, list: set.list as SetList }} />
    </>
  )
}
