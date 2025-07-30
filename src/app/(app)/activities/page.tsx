import { notFound } from 'next/navigation'

import Activities from './_components/activities'

import { getSetList } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { SelectedSet } from '@/types/models/set'

export const dynamic = 'force-dynamic'

export default async function ActivitiesPage() {
  const res: { sets: SelectedSet[]; error: null } | Err = await getSetList()

  if (res.error) notFound()

  return (
    <>
      <Activities sets={res.sets} />
    </>
  )
}
