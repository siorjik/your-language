import { notFound } from 'next/navigation'

import Activities from './_components/activities'

import { getSetList, getSetsCreators } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { SelectedSet, SetCreator } from '@/types/models/set'

export const dynamic = 'force-dynamic'

export default async function ActivitiesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams

  const res: { sets: SelectedSet[]; error: null } | Err = await getSetList(params)
  const setsCreatorsRes: { creatorList: SetCreator[] | null; error: null } | Err = await getSetsCreators()

  if (res.error || setsCreatorsRes.error) notFound()

  return (
    <>
      <Activities sets={res.sets} creatorList={setsCreatorsRes.creatorList!} />
    </>
  )
}
