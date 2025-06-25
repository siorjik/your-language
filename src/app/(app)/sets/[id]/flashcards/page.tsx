import { notFound } from 'next/navigation'

import Flashcards from './_components/flashcards'
import BreadcrumbWrap from '@/components/breadcrumb-wrap'

import { getSetById } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { Set } from '@prisma/client'
import { getSetAppPath, setsAppPath } from '@/utils/paths'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const set: (Set & { error: null }) | Err = await getSetById(id)

  if (set.error) notFound()

  return { title: `${set.title} (flashcards)`, description: `${set.title} (flashcards) page` }
}

export default async function FlashcardsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const set: (Set & { error: null }) | Err = await getSetById(id)

  if (set.error) notFound()

  const breadcrumbData = {
    links: [
      { href: setsAppPath, label: 'sets' },
      { href: getSetAppPath(set.id), label: `${set.title}` },
    ],
    current: 'flashcards',
  }

  return (
    <>
      <BreadcrumbWrap data={breadcrumbData} />
      <Flashcards data={set} />
    </>
  )
}
