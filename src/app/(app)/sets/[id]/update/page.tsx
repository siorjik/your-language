import Link from 'next/link'
import { notFound } from 'next/navigation'

import SetForm from '@/components/forms/set-form'
import { Button } from '@/components/ui/button'

import { getSetAppPath } from '@/utils/paths'
import { getSetById } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { Set } from '@prisma/client'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const set: (Set & { error: null }) | Err = await getSetById(id)

  if (set.error) notFound()

  return { title: `${set.title}`, description: `${set.title} update page` }
}

export default async function SetUpdate({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const set: (Set & { error: null }) | Err = await getSetById(id)

  if (set.error) notFound()

  return (
    <>
      <Button className="mb-8" asChild>
        <Link href={getSetAppPath(id)}>Cancel</Link>
      </Button>
      <SetForm data={{ ...set, list: set.list as { term: string; definition: string }[] }} action="update" />
    </>
  )
}
