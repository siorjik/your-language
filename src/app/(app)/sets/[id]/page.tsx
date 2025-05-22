import { notFound } from 'next/navigation'
import Link from 'next/link'
import { GalleryHorizontal, FilePenLine } from 'lucide-react'

import SetForm from '@/components/forms/set-form'
import { Button } from '@/components/ui/button'
import BreadcrumbWrap from '@/components/breadcrumb-wrap'

import { getSetById } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { Set } from '@prisma/client'
import { getFlashcardsAppPath, getUpdateSetAppPath, setAppPath } from '@/utils/paths'
import { SetList } from '@/types/models/set'

export default async function SetData({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const set: (Set & { error: null }) | Err = await getSetById(id)

  if (set.error) notFound()

  const breadcrumbData = { links: [{ href: setAppPath, label: 'sets' }], current: set.title }

  return (
    <>
      <BreadcrumbWrap data={breadcrumbData} />
      <div className="mb-5 flex justify-between">
        <Button asChild>
          <Link href={getUpdateSetAppPath(id)}>
            <FilePenLine />
            Update
          </Link>
        </Button>
        <div className="flex">
          <Button variant="outline" asChild>
            <Link href={getFlashcardsAppPath(id)}>
              <GalleryHorizontal />
              Flashcards
            </Link>
          </Button>
        </div>
      </div>
      <SetForm data={{ ...set, list: set.list as SetList }} />
    </>
  )
}
