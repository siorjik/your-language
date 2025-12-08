'use client'

import { useEffect, useRef, useState } from 'react'
import { CirclePlus, Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

import Link from '@/components/link'
import DialogWrap from '@/components/dialog-wrap'
import { Button } from '@/components/ui/button'
import ClassForm from './class-form'
import { Input } from '@/components/ui/input'
import Spinner from '@/components/spinner'
import ClassItem from './class-item'

import getQueryString from '@/helpers/getQueryString'
import { classesAppPath, getClassAppPath, libraryAppPath } from '@/utils/paths'
import { SelectedSet } from '@/types/models/set'
import { SelectedClass } from '@/types/models/class'
import useLocaleUrl from '@/hooks/use-locale-url'

export default function ClassList({ sets, classes }: { sets: SelectedSet[]; classes: SelectedClass[] }) {
  const [isClosed, setClosed] = useState(false)
  const [value, setValue] = useState('')
  const [isLoader, setLoader] = useState(false)

  const params = useSearchParams()
  const { push } = useRouter()
  const { getLocaleUrl } = useLocaleUrl()
  const t = useTranslations('Classes')

  const titleParam = params.get('title')

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

      push(getLocaleUrl(`${classesAppPath}?${q}`))
    }, 1000)
  }

  const onReset = () => {
    if (!value) return

    setValue('')

    const q = getQueryString({ currentParams: params, toDeleteParams: ['title'] })

    push(getLocaleUrl(`${classesAppPath}?${q}`))
  }

  const onSuccess = () => {
    setLoader(true)
    setClosed(true)

    setTimeout(() => {
      setLoader(false)
      setClosed(false)
    }, 500)
  }

  return (
    <>
      {(!!sets.length || !!classes.length) && (
        <div className="mb-8 flex flex-col md:flex-row gap-5 md:gap-10 justify-between">
          {!!sets.length && (
            <DialogWrap
              title={t('createClass')}
              trigger={
                <Button>
                  <>
                    <CirclePlus />
                    {t('createNew')}
                  </>
                </Button>
              }
              isAutoClose={isClosed}
              content={<ClassForm action="create" sets={sets} onSuccess={onSuccess} />}
            />
          )}
          {(!!classes?.length || titleParam) && (
            <div className="w-full max-w-[700px] relative">
              <span className="h-10 w-10 bg-secondary/40 absolute top-0 left-0 flex justify-center items-center rounded-l-md">
                <Search />
              </span>
              <Input
                className="w-full px-12 border-0 bg-secondary/30 !text-lg"
                placeholder={t('search')}
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
        </div>
      )}

      {!isLoader && !sets.length && !classes.length && (
        <div className="h-[calc(100vh-160px)] flex flex-col justify-center items-center">
          <p className="mb-1 text-lg font-semibold">{t('noCreated')} 🤨</p>
          <Link href={libraryAppPath} className="link text-xl">
            {t('visitLibrary')} {'>>>'}
          </Link>
        </div>
      )}

      {!isLoader && !!classes?.length ? (
        <>
          <h2 className="sub-title-1">
            {t('yourClasses')} {classes.length}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {classes.map((el, idx) => (
              <Link key={el.id} href={getClassAppPath(el.id)}>
                <ClassItem data={el} idx={idx} />
              </Link>
            ))}
          </div>
          {!sets.length && (
            <div className="w-fit mt-10 mx-auto text-center">
              <p className="mb-1 text-lg font-semibold">{t('noCreated')} 🤨</p>
              <Link href={libraryAppPath} className="link text-xl">
                {t('createSet')} {'>>>'}
              </Link>
            </div>
          )}
        </>
      ) : isLoader ? null : !!sets.length && !classes.length ? (
        <p className="w-fit mx-auto text-lg font-semibold">{t('noAny')} 🤨</p>
      ) : null}

      {isLoader && <Spinner />}
    </>
  )
}
