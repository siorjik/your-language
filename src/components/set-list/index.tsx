'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
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

export default function SetList({
  sets,
  creatorList,
  isSimple = false,
}: {
  sets: SelectedSet[]
  creatorList?: SetCreator[]
  isSimple?: boolean
}) {
  const [isLoader, setLoader] = useState(false)
  const [value, setValue] = useState('')

  const { push } = useRouter()
  const params = useSearchParams()

  const titleParam = params.get('title')
  const fromParam = params.get('from')
  const toParam = params.get('to')

  const inputRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (titleParam) {
      if (!value) setValue(titleParam)

      setTimeout(() => inputRef.current?.focus(), 500)
    }
  }, [params])

  const onChange = (val: string) => {
    setValue(val)

    clearTimeout(timeoutRef.current as NodeJS.Timeout)

    timeoutRef.current = setTimeout(() => {
      setLoader(true)

      const q = getQueryString({
        currentParams: params,
        newParams: { title: val.trim() },
        toDeleteParams: !val ? ['title'] : null,
      })

      push(`${setsAppPath}?${q}`)

      setTimeout(() => setLoader(false), 500)
    }, 1000)
  }

  const onReset = () => {
    if (!value) return

    setLoader(true)
    setValue('')

    setTimeout(() => setLoader(false), 1000)

    const q = getQueryString({ currentParams: params, toDeleteParams: ['title'] })

    push(`${setsAppPath}?${q}`)
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
            {(!!sets.length || titleParam) && (
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
            {(!!sets.length || fromParam || toParam) && <Filter creatorList={creatorList!} />}
          </>
        )}
      </div>
      {!isLoader && !!sets.length ? (
        <>
          {!isSimple && <h2 className="sub-title-1">Your Sets:</h2>}
          {sets.map((set, idx) => (
            <Link key={set.id} href={getSetAppPath(set.id)}>
              <SetItem set={set} idx={idx} isSimple={isSimple} />
            </Link>
          ))}
        </>
      ) : isLoader ? null : (
        <p className="w-fit mx-auto text-lg font-semibold">There are no any Sets 🤨</p>
      )}
      {isLoader && <Spinner />}
    </>
  )
}
