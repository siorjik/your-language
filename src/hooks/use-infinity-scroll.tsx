'use client'

import { useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'

type ParamsProps<T> = { queryKey: string[]; fetchFn: (cursor: string) => Promise<T> | undefined }
type Page<T> = T & { nextCursor?: string | number }
type ReturnType<T> = {
  result: T[] | undefined
  status: string
  hasNextPage: boolean
  isFetchingNextPage: boolean
  ref: (node?: Element | null | undefined) => void
}

export function useInfiniteScroll<T>({ queryKey, fetchFn }: ParamsProps<T>): ReturnType<T> {
  const { ref, inView } = useInView()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }): Promise<Page<T>> => fetchFn('' + pageParam) as Promise<Page<T>>,
    initialPageParam: undefined as string | number | undefined,
    getNextPageParam: (lastPage: Page<T>) => lastPage?.nextCursor ?? undefined,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const result = data?.pages

  return { result, status, hasNextPage, isFetchingNextPage, ref }
}
