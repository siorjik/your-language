'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

import { Combobox } from '@/components/combobox'
import Tabs from '@/components/activity-tabs'
import Spinner from '@/components/spinner'

import { SelectedSet } from '@/types/models/set'
import { ModalContextProvider } from '@/contexts/modal-context'

export default function Activities({ sets }: { sets: SelectedSet[] }) {
  const [id, setId] = useState<string | null>(null)
  const [isLoading, setLoading] = useState(false)

  const t = useTranslations('Activities')

  useEffect(() => {
    if (!sets.find((set) => set.id === id)) setId(sets[0].id)
  }, [sets, id])

  useEffect(() => {
    setLoading(true)
    setTimeout(() => setLoading(false), 500)
  }, [id])

  return (
    <ModalContextProvider>
      <div className="w-fit mx-auto mb-10 flex items-center gap-3">
        <span className="sub-title-3 mb-0">{t('chooseSet')}</span>
        <div className="w-[200px]">
          <Combobox
            key={id}
            placeholder={t('chooseSet')}
            searchText={t('searchSet')}
            notFoundText={t('notFound')}
            data={sets.map((set) => ({ value: set.title, label: set.title, id: set.id }))}
            getValue={(val) => setId(val)}
            value={sets.find((set) => set.id === id)?.title || sets[0].title}
          />
        </div>
      </div>
      {id && <Tabs set={sets.find((set) => set.id === id)!} />}
      {isLoading && <Spinner />}
    </ModalContextProvider>
  )
}
