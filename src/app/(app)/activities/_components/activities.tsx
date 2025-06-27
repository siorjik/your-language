'use client'

import { useState } from 'react'
import Link from 'next/link'

import Tabs from './tabs'
import { Combobox } from '@/components/combobox'

import { Set } from '@prisma/client'
import { newSetAppPath } from '@/utils/paths'

export default function Activities({ sets }: { sets: Set[] }) {
  const [id, setId] = useState<string | null>(sets[0]?.id)

  return (
    <>
      {!!sets.length ? (
        <>
          <div className="mb-10 flex justify-center items-center gap-3">
            <span className="sub-title-3 mb-0">Choose Set:</span>
            <div className="w-[200px]">
              <Combobox
                placeholder="Choose Set..."
                searchText="Search Set..."
                notFoundText="Set was not found..."
                data={sets.map((set) => ({ value: set.title, label: set.title, id: set.id }))}
                getValue={(val) => setId(val)}
                value={sets[0].title}
              />
            </div>
          </div>
          <Tabs set={sets.find((set) => set.id === id)!} />
        </>
      ) : (
        <>
          <span>No created sets,</span>{' '}
          <Link href={newSetAppPath} className="link">
            create a new one!
          </Link>
        </>
      )}
    </>
  )
}
