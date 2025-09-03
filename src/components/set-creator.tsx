'use client'

import { User2 } from 'lucide-react'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'

import { SelectedSet, SetCreator as SetCreatorType } from '@/types/models/set'
import Link from 'next/link'
import { getUserAppPath } from '@/utils/paths'
import { useEffect, useState } from 'react'
import { getSetById } from '@/actions/set'
import { Err } from '@/types/errTypes'

export default function SetCreator({ setId }: { setId: string }) {
  const [creatorData, setCreatorData] = useState<SetCreatorType | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const set: (SelectedSet & { error: null }) | Err = await getSetById(setId)

        if (set.error) throw set.error
        else
          setCreatorData({
            img: set.owner?.image || set.user!.image,
            createdBy: set.owner?.name || set.user!.name,
            createdAt: set.createdAt,
            id: set.owner?.id || set.user!.id,
          })
      } catch (error) {
        console.log(error)
      }
    })()
  }, [setId])

  return (
    <>
      {creatorData?.id ? (
        <Link href={getUserAppPath(creatorData.id)}>
          <div className="w-56 flex items-center">
            {creatorData.img ? (
              <Image className="w-10 h-10 rounded-full object-cover" src={creatorData.img} width={100} height={100} alt="user" />
            ) : (
              <User2 className="w-10 h-10 pt-1 pb-2 border-2 rounded-full" />
            )}
            <div className="ml-2 flex flex-col text-xs gap-1 text-primary/80 overflow-hidden">
              <span className="truncate">created by: {creatorData.createdBy}</span>
              <span className="truncate">created at: {formatDistanceToNow(creatorData.createdAt, { addSuffix: true })}</span>
            </div>
          </div>
        </Link>
      ) : (
        <div className="flex w-56 items-center gap-4 animate-pulse">
          <div className="bg-primary/50 h-10 w-10 shrink-0 rounded-full"></div>
          <div className="flex flex-col gap-4">
            <div className="bg-primary/50 h-2 w-20 rounded-lg"></div>
            <div className="bg-primary/50 h-2 w-28 rounded-lg"></div>
          </div>
        </div>
      )}
    </>
  )
}
