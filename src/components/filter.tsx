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
import MultipleSelector from './multi-select'

import getQueryString from '@/helpers/getQueryString'
import { SetCreator } from '@/types/models/set'

type FilterType = { from?: Date | undefined; to?: Date | undefined; creators?: { label: string; value: string }[] }

export default function Filter({ creatorList }: { creatorList: SetCreator[] }) {
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
          params = { ...params, [k]: new Date(v) }
        } else if (k === 'creators') params = { ...params, [k]: getValues(v.split(',')) }
        else params = { ...params, [k]: v }
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
    const creators = filter?.creators?.map((el) => el.value)
    const filterCopy = { ...filter, creators }

    if (filterCopy.from && !filterCopy.to) filterCopy.to = new Date()
    if (!filterCopy.creators) delete filterCopy.creators

    const q = getQueryString({ currentParams: searchParams, newParams: { ...filterCopy } as Omit<FilterType, 'creators'> })

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

    const q = getQueryString({ currentParams: searchParams, toDeleteParams: ['from', 'to', 'creators'] })

    push(`${pathname}?${q}`)
  }

  const getOptions = () => {
    const creators: { label: string; value: string }[] = []

    creatorList.forEach((item) => {
      if (!creators.find((el) => el.value === item.creator?.id)) {
        creators.push({ label: item.creator!.name, value: item.creator!.id })
      }
    })

    return creators
  }

  const getValues = (arr: string[]): { label: string; value: string }[] => {
    const val: { label: string; value: string }[] = []

    creatorList.forEach((el) => {
      if (arr.includes(el.creator.id)) val.push({ label: el.creator.name, value: el.creator.id })
    })

    return val
  }

  return (
    <>
      <Sheet open={show} onOpenChange={setShow}>
        <SheetTrigger asChild>
          <div className="flex gap-3">
            <Button onClick={() => setShow(!show)}>Filters</Button>
            {(filter?.from || filter?.creators) && (
              <Button variant="warn" onClick={onClear}>
                Clear Filters
              </Button>
            )}
          </div>
        </SheetTrigger>
        <SheetContent className="flex flex-col justify-between">
          <div>
            <SheetHeader className="mb-5">
              <SheetTitle>Choose filters:</SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>
            <div className="flex flex-col">
              <div className="mb-5 flex flex-col md:flex-row gap-5">
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
              <MultipleSelector
                className="max-w-[250px] md:max-w-[400px]"
                value={filter?.creators || []}
                label="Creators"
                placeholder="Choose Creators"
                options={getOptions()}
                onChange={(val: { label: string; value: string }[]) => setFilter({ ...filter, creators: val })}
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
