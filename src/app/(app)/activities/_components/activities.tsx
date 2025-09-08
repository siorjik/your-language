'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FileCog, Share } from 'lucide-react'

import Tabs from './tabs'
import { Combobox } from '@/components/combobox'
import { Button } from '@/components/ui/button'
import DialogWrap from '@/components/dialog-wrap'
import SetForm from '@/components/forms/set-form'
import ShareBtn from '@/components/share-btn'
import Filter from '@/components/filter'

import { libraryAppPath } from '@/utils/paths'
import { SelectedSet } from '@/types/models/set'

export default function Activities({ sets }: { sets: SelectedSet[] }) {
  const [id, setId] = useState<string | null>(() => sets[0].id)
  const [isComboOpen, setComboOpen] = useState(false)
  const [isAutoClose, setAutoClose] = useState(false)

  const searchParams = useSearchParams()

  useEffect(() => {
    setId(sets[0].id)
  }, [searchParams.toString()])

  return (
    <>
      {!!sets.length ? (
        <>
          <h2 className="mx-auto w-fit title">Training with Sets</h2>
          <div className="mb-10 flex flex-col md:flex-row justify-between items-center gap-5">
            <div className="flex items-center gap-3">
              <span className="sub-title-3 mb-0">Choose Set:</span>
              <div className="w-[200px]">
                <Combobox
                  key={Number(isAutoClose) || searchParams.toString()}
                  placeholder="Choose Set..."
                  searchText="Search Set..."
                  notFoundText="Set was not found..."
                  data={sets.map((set) => ({ value: set.title, label: set.title, id: set.id }))}
                  getValue={(val) => setId(val)}
                  value={sets[sets.findIndex((set) => set.id === id || sets[0].id)].title}
                  checkIsActive={(val) => setComboOpen(val)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <DialogWrap
                width="max-w-3xl"
                title="Set Update"
                isAutoClose={isAutoClose}
                trigger={
                  <Button>
                    <FileCog />
                    Update
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
                    Share
                  </Button>
                }
                id={id!}
              />
            </div>
            <Filter />
          </div>
          <Tabs set={sets.find((set) => set.id === id)!} isComboOpen={isComboOpen} />
        </>
      ) : (
        <div className="h-[calc(100vh-160px)] flex flex-col justify-center items-center">
          <p className="mb-1 text-lg font-semibold">No created Sets yet 🤨</p>
          <Link href={libraryAppPath} className="link text-xl">
            Visit Library and create a new one {'>>>'}
          </Link>
        </div>
      )}
    </>
  )
}
