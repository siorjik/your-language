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
        <Link className="w-fit max-w-48 inline-block" href={getUserAppPath(creatorData.id)}>
          <div className="flex items-center gap-2">
            {creatorData.img ? (
              <Image
                className="min-w-10 max-w-10 h-10 rounded-full object-cover"
                src={creatorData.img}
                width={50}
                height={50}
                alt="user"
              />
            ) : (
              <User2 className="w-10 h-10 pt-1 pb-2 border-2 rounded-full" />
            )}
            <div className="flex flex-col text-xs text-primary/80 overflow-hidden hover:text-foreground">
              <span className="truncate leading-normal">Created by {creatorData.createdBy},</span>
              <span className="truncate leading-normal">{formatDistanceToNow(creatorData.createdAt, { addSuffix: true })}</span>
            </div>
          </div>
        </Link>
      ) : (
        <div className="flex items-center gap-4 animate-pulse">
          <div className="bg-primary/50 h-10 w-10 shrink-0 rounded-full"></div>
          <div className="flex flex-col gap-4">
            <div className="bg-primary/50 h-2 w-28 rounded-lg"></div>
            <div className="bg-primary/50 h-2 w-24 rounded-lg"></div>
          </div>
        </div>
      )}
    </>
  )
}
