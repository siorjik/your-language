import { notFound } from 'next/navigation'

import { getSetList } from '@/actions/set'
import { Set } from '@prisma/client'
import { Err } from '@/types/errTypes'
import SetList from './_components/set-list'

export default async function Sets({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const { title = '' } = await searchParams

  const res: { sets: Set[]; filtered: Set[]; error: null } | Err = await getSetList({ title })

  if (res.error) notFound()

  return (
    <>
      {!res.sets.length ? (
        <p className="w-fit mx-auto">There are no sets yet...</p>
      ) : (
        <SetList sets={!!title ? res.filtered : res.sets} />
      )}
    </>
  )
}
