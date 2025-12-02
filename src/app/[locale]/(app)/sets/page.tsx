import { notFound } from 'next/navigation'
import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query'

import SetList from '@/components/set-list'

import { getSetList, getSetsCreators } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { SetCreator } from '@/types/models/set'
import { INFINITY_SCROLL_LIMIT } from '@/utils/constants'

export default async function Sets({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams

  const queryClient = new QueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['sets'],
    queryFn: () => getSetList({ filter: params, limit: INFINITY_SCROLL_LIMIT }),
    initialPageParam: 1,
  })

  const setsCreatorsRes: { creatorList: SetCreator[] | null; error: null } | Err = await getSetsCreators()

  if (setsCreatorsRes.error) notFound()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SetList queryKey={['sets']} creatorList={setsCreatorsRes.creatorList!} />
    </HydrationBoundary>
  )
}
