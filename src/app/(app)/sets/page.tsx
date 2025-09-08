import { notFound } from 'next/navigation'

import SetList from '@/components/set-list'

import { getSetList } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { SelectedSet } from '@/types/models/set'

export default async function Sets({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams

  const res: { sets: SelectedSet[]; error: null } | Err = await getSetList(params)

  if (res.error) notFound()

  return <SetList sets={res.sets} />
}
