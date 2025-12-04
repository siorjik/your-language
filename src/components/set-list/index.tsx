'use client'

import { useRef, useEffect, useState } from 'react'
import Link from '@/components/link'
import { CirclePlus, Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import SetItem from './set-item'
import { Input } from '@/components/ui/input'
import Filter from '../filter'

import { getSetAppPath, newSetAppPath, setsAppPath } from '@/utils/paths'
import Spinner from '@/components/spinner'
import { SelectedSet, SetCreator } from '@/types/models/set'
import getQueryString from '@/helpers/getQueryString'
import { useInfiniteScroll } from '@/hooks/use-infinity-scroll'
import { getSetList } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { INFINITY_SCROLL_LIMIT } from '@/utils/constants'
import useLocaleUrl from '@/hooks/use-locale-url'

type ReturnType = { sets: SelectedSet[]; count: number; error: null; nextCursor?: string | null } | Err

export default function SetList({
  setList,
  creatorList,
  isSimple = false,
  queryKey = [],
  userId = undefined,
}: {
  setList?: SelectedSet[]
  creatorList?: SetCreator[]
  isSimple?: boolean
  queryKey?: string[]
  userId?: string | undefined
}) {
  const [isLoader, setLoader] = useState(false)
  const [value, setValue] = useState('')

  const { push } = useRouter()
  const params = useSearchParams()
  const { getLocaleUrl } = useLocaleUrl()

  const titleParam = params.get('title')
  const fromParam = params.get('from')
  const toParam = params.get('to')
  const creatorsParam = params.get('creators')

  const { result, hasNextPage, isFetchingNextPage, ref } = useInfiniteScroll<ReturnType>({
    queryKey,
    fetchFn: (cursor: string) =>
      !!setList?.length
        ? undefined
        : getSetList({
            cursor,
            filter: {
              title: titleParam ?? undefined,
              from: fromParam ?? undefined,
              to: toParam ?? undefined,
              creators: creatorsParam ?? undefined,
            },
            limit: INFINITY_SCROLL_LIMIT,
            id: userId,
          }),
  })

  const sets = result && result[0] !== undefined ? result.map((el) => (!el?.error ? el?.sets : [])).flat() : setList
  const count = setList ? setList.length : result?.[0].error === null ? result?.[0].count : 0

  const inputRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (titleParam) {
      if (!value) setValue(titleParam)

      setTimeout(() => inputRef.current?.focus(), 500)
    }

    setLoader(true)
    setTimeout(() => setLoader(false), 500)
  }, [params])

  const onChange = (val: string) => {
    setValue(val)

    clearTimeout(timeoutRef.current as NodeJS.Timeout)

    timeoutRef.current = setTimeout(() => {
      const q = getQueryString({
        currentParams: params,
        newParams: { title: val.trim() },
        toDeleteParams: !val ? ['title'] : null,
      })

      push(getLocaleUrl(`${setsAppPath}?${q}`))
    }, 1000)
  }

  const onReset = () => {
    if (!value) return

    setValue('')

    const q = getQueryString({ currentParams: params, toDeleteParams: ['title'] })

    push(getLocaleUrl(`${setsAppPath}?${q}`))
  }

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row gap-5 md:gap-10 justify-between">
        {!isSimple && (
          <Button asChild>
            <Link href={newSetAppPath}>
              <CirclePlus />
              Create New
            </Link>
          </Button>
        )}
        {!isSimple && (
          <>
            {(!!sets?.length || titleParam) && (
              <div className="w-full max-w-[700px] relative">
                <span className="h-10 w-10 bg-secondary/40 absolute top-0 left-0 flex justify-center items-center rounded-l-md">
                  <Search />
                </span>
                <Input
                  className="w-full px-12 border-0 bg-secondary/30 !text-lg"
                  placeholder="Search by Set title..."
                  onChange={(e) => onChange(e.target.value)}
                  value={value}
                  ref={inputRef}
                />
                {value && (
                  <span
                    className="h-10 w-10 bg-secondary/40 absolute top-0 right-0 flex justify-center items-center rounded-r-md"
                    onClick={onReset}
                  >
                    <X />
                  </span>
                )}
              </div>
            )}
            {(!!sets?.length || fromParam || toParam) && <Filter creatorList={creatorList!} />}
          </>
        )}
      </div>
      {!isLoader && !!sets?.length ? (
        <>
          {!isSimple && <h2 className="sub-title-1">Your Sets: {count}</h2>}
          {sets.map((set, idx) => (
            <div key={set.id} ref={ref}>
              <Link href={getSetAppPath(set.id)}>
                <SetItem set={set} idx={idx} isSimple={isSimple} />
              </Link>
            </div>
          ))}
        </>
      ) : isLoader ? null : (
        <p className="w-fit mx-auto text-lg font-semibold">There are no any Sets 🤨</p>
      )}
      {((isFetchingNextPage && hasNextPage) || isLoader) && <Spinner />}
    </>
  )
}
