'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { CirclePlus, Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import SetItem from './set-item'
import { Input } from '@/components/ui/input'

import { getSetAppPath, newSetAppPath, setsAppPath } from '@/utils/paths'
import { Set } from '@prisma/client'
import Spinner from '@/components/spinner'

export default function SetList({ sets }: { sets: Set[] }) {
  const [isLoader, setLoader] = useState(false)
  const [value, setValue] = useState('')

  const { push } = useRouter()
  const params = useSearchParams()

  const titleParam = params.get('title')

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

      push(`${setsAppPath}?title=${val.trim()}`)

      setTimeout(() => setLoader(false), 500)
    }, 1000)
  }

  const onReset = () => {
    if (!value) return

    setLoader(true)
    setValue('')

    setTimeout(() => setLoader(false), 1000)

    push(setsAppPath)
  }

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row gap-5 md:gap-10 justify-between">
        <Button asChild>
          <Link href={newSetAppPath}>
            <CirclePlus />
            Create New
          </Link>
        </Button>
        {!!sets.length && <div className="w-full max-w-[700px] relative">
          <span className="h-10 w-10 bg-secondary/40 absolute top-0 left-0 flex justify-center items-center rounded-l-md">
            <Search />
          </span>
          <Input
            className="w-full px-12 border-0 bg-secondary/30 !text-lg"
            placeholder="Search by set title..."
            onChange={(e) => onChange(e.target.value)}
            value={value}
            ref={inputRef}
          />
          <span
            className="h-10 w-10 bg-secondary/40 absolute top-0 right-0 flex justify-center items-center rounded-r-md"
            onClick={onReset}
          >
            <X />
          </span>
        </div>}
      </div>
      {!isLoader && !!sets.length ? (
        sets.map((set) => (
          <Link key={set.id} href={getSetAppPath(set.id)}>
            <SetItem set={set} />
          </Link>
        ))
      ) : isLoader ? null : (
        <p className="w-fit mx-auto">There are no any sets...</p>
      )}
      {isLoader && <Spinner />}
    </>
  )
}
