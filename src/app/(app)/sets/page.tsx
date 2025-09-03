import { notFound } from 'next/navigation'

import SetList from '@/components/set-list'

import { getSetList } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { SelectedSet } from '@/types/models/set'

export default async function Sets({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const { title = '' } = await searchParams

  const res: { sets: SelectedSet[]; filtered: SelectedSet[]; error: null } | Err = await getSetList({ title })

  if (res.error) notFound()

  return <SetList sets={!!title ? res.filtered : res.sets} />
}
