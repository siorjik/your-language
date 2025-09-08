'use client'

import { MouseEvent, useCallback, useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from './ui/button'
import DatePicker from './date-picker'
import Spinner from './spinner'
import getQueryString from '@/helpers/getQueryString'

type FilterType = { from?: Date | undefined; to?: Date | undefined }

export default function Filter() {
  const [show, setShow] = useState(false)
  const [filter, setFilter] = useState<FilterType | null>(null)
  const [showLoader, setShowLoader] = useState(false)

  const { push } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    let params: FilterType = {}

    if (!!searchParams.size) {
      for (const [k, v] of searchParams.entries()) {
        if (k === 'from' || k === 'to') {
          params = !isNaN(Date.parse(v)) ? { ...params, [k]: new Date(v) } : { ...params, [k]: v }
        }
      }

      if (Object.keys(params).length) setFilter((prev) => ({ ...prev, ...params }))
    }
  }, [searchParams.toString()])

  const onDate = useCallback(
    (name: 'from' | 'to', date: Date) =>
      setFilter(filter ? { ...filter, [name]: date! } : ({ [name]: date! } as Pick<FilterType, 'from' | 'to'>)),
    [filter],
  )

  const onApply = () => {
    const q = getQueryString({ currentParams: searchParams, newParams: { to: new Date(), ...filter } as FilterType })

    setShow(false)
    setShowLoader(true)

    setTimeout(() => setShowLoader(false), 1000)

    push(`${pathname}?${q}`)
  }

  const onClear = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    setFilter(null)
    setShow(false)

    setTimeout(() => setShowLoader(false), 1000)

    const q = getQueryString({ currentParams: searchParams, toDeleteParams: ['from', 'to'] })

    push(`${pathname}?${q}`)
  }

  return (
    <>
      <Sheet open={show} onOpenChange={setShow}>
        <SheetTrigger asChild>
          <div className="flex gap-3">
            <Button onClick={() => setShow(!show)}>Filters</Button>
            {filter?.from && (
              <Button variant="warn" onClick={onClear}>
                Clear Filters
              </Button>
            )}
          </div>
        </SheetTrigger>
        <SheetContent className="flex flex-col justify-between">
          <div>
            <SheetHeader>
              <SheetTitle>Choose filters:</SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>
            <div className="flex flex-col md:flex-row gap-5">
              <DatePicker
                label="Date From"
                cb={(from) => onDate('from', from)}
                date={filter?.from}
                disabledDate={{ lessMore: 'more', value: new Date() }}
              />
              <DatePicker
                label="Date To"
                cb={(to) => onDate('to', to)}
                date={filter?.to}
                disabledDate={{ lessMore: 'less', value: filter?.from || new Date() }}
                disabled={!filter?.from}
              />
            </div>
          </div>
          {filter && (
            <SheetFooter className="gap-3 md:gap-1">
              <Button size="sm" onClick={onApply}>
                Apply
              </Button>
              <SheetClose asChild>
                <Button size="sm" variant="outline" onClick={onClear}>
                  Clear
                </Button>
              </SheetClose>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
      {showLoader && <Spinner />}
    </>
  )
}
