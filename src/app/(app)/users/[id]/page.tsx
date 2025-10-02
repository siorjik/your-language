import Image from 'next/image'
import { notFound } from 'next/navigation'
import { User2 } from 'lucide-react'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

import Tabs from './_components/tabs'

import { getSetList } from '@/actions/set'
import { getUserById } from '@/actions/user'
import { Err } from '@/types/errTypes'
import { SelectedUser } from '@/types/models/user'
import { INFINITY_SCROLL_LIMIT } from '@/utils/constants'
import { getClassList } from '@/actions/class'
import { SelectedClass } from '@/types/models/class'
import { SelectedSet } from '@/types/models/set'

export default async function User({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const user: SelectedUser | null | Err = await getUserById(id)

  const res: { classes: SelectedClass[]; error: null } | Err = await getClassList({ userId: id })
  const resSet: { sets: SelectedSet[]; error: null; count: number } | Err = await getSetList({ id })

  if (!user || user.error || res.error || resSet.error) notFound()

  const queryClient = new QueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['sets', user.id],
    queryFn: () => getSetList({ id: user.id, limit: INFINITY_SCROLL_LIMIT }),
    initialPageParam: 1,
  })

  return (
    <>
      <div className="w-fit mb-10 mx-auto">
        <h2 className="w-fit mx-auto sub-title-1">{user.name}</h2>
        {!!user.image ? (
          <Image className="rounded-full object-cover w-40 h-40" width={100} height={100} src={user.image} alt="user" priority />
        ) : (
          <User2 className="w-40 h-40 pb-5 border-2 rounded-full" />
        )}
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Tabs userId={user.id} classes={res.classes} setsAmount={resSet.count} />
      </HydrationBoundary>
    </>
  )
}
