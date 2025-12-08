'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { FileCog, Share } from 'lucide-react'
import { useTranslations } from 'next-intl'

import Link from '@/components/link'
import Tabs from '@/components/activity-tabs'
import { Combobox } from '@/components/combobox'
import { Button } from '@/components/ui/button'
import DialogWrap from '@/components/dialog-wrap'
import SetForm from '@/components/forms/set-form'
import ShareBtn from '@/components/share-btn'
import Filter from '@/components/filter'
import Spinner from '@/components/spinner'

import { libraryAppPath } from '@/utils/paths'
import { SelectedSet, SetCreator } from '@/types/models/set'
import { ModalContextProvider } from '@/contexts/modal-context'

export default function Activities({ sets, creatorList }: { sets: SelectedSet[]; creatorList: SetCreator[] }) {
  const [id, setId] = useState<string | null>(null)
  const [isAutoClose, setAutoClose] = useState(false)
  const [isLoader, setLoader] = useState(false)

  const searchParams = useSearchParams()
  const t = useTranslations('Activities')
  const tBtn = useTranslations('btn')

  const fromParam = searchParams.get('from')
  const toParam = searchParams.get('to')
  const isParams = fromParam || toParam

  useEffect(() => {
    if (!!sets.length) setId(sets[0].id)

    setLoader(true)
    setTimeout(() => setLoader(false), 500)
  }, [searchParams])

  useEffect(() => {
    setLoader(true)
    setTimeout(() => setLoader(false), 500)
  }, [id])

  return (
    <ModalContextProvider>
      {!!sets.length ? (
        <>
          <h2 className="mx-auto w-fit title">{t('title')}</h2>
          <div className="mb-10 flex flex-col lg:flex-row justify-between items-center gap-5">
            <div className="flex items-center gap-3">
              <span className="sub-title-3 mb-0">{t('chooseSet')}</span>
              <div className="w-[200px]">
                <Combobox
                  key={searchParams.toString()}
                  placeholder={t('chooseSet')}
                  searchText={t('searchSet')}
                  notFoundText={t('notFound')}
                  data={sets.map((set) => ({ value: set.title, label: set.title, id: set.id }))}
                  getValue={(val) => setId(val)}
                  value={sets[sets.findIndex((set) => set.id === id || sets[0].id)].title}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <DialogWrap
                width="max-w-3xl"
                title={t('setUpdate')}
                isAutoClose={isAutoClose}
                trigger={
                  <Button>
                    <FileCog />
                    {tBtn('update')}
                  </Button>
                }
                content={
                  <SetForm
                    data={sets.find((set) => set.id === id) as SelectedSet}
                    action="update"
                    btnStyle="dialog-submit-btn"
                    afterSubmitFn={() => {
                      setAutoClose(true)

                      setTimeout(() => setAutoClose(false), 1000)
                    }}
                  />
                }
              />
              <ShareBtn
                trigger={
                  <Button>
                    <Share />
                    {tBtn('share')}
                  </Button>
                }
                id={id!}
              />
            </div>
            <Filter creatorList={creatorList} />
          </div>
          <Tabs set={sets.find((set) => set.id === id)!} />
          {isLoader && <Spinner />}
        </>
      ) : (
        <div className="h-[calc(100vh-160px)] flex flex-col justify-center items-center">
          {!isParams ? (
            <>
              <p className="mb-1 text-lg font-semibold">{t('noCreated')} 🤨</p>
              <Link href={libraryAppPath} className="link text-xl">
                {t('visitLibrary')} {'>>>'}
              </Link>
            </>
          ) : (
            <>
              <div className="mb-5">
                <Filter creatorList={creatorList} />
              </div>
              <p className="mb-1 text-lg font-semibold">{t('noAny')} 🤨</p>
            </>
          )}
        </div>
      )}
    </ModalContextProvider>
  )
}
