import { notFound } from 'next/navigation'

import SetList from './_components/set-list'

import { getSetList } from '@/actions/set'
import { Set } from '@prisma/client'
import { Err } from '@/types/errTypes'

export default async function Sets({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const { title = '' } = await searchParams

  const res: { sets: Set[]; filtered: Set[]; error: null } | Err = await getSetList({ title })

  if (res.error) notFound()

  return <SetList sets={!!title ? res.filtered : res.sets} />
}
