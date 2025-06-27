import { notFound } from 'next/navigation'

import Activities from './_components/activities'

import { getSetList } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { Set } from '@prisma/client'

export const dynamic = 'force-dynamic'

export default async function ActivitiesPage() {
  const res: { sets: Set[]; error: null } | Err = await getSetList()

  if (res.error) notFound()

  return <Activities sets={res.sets} />
}
