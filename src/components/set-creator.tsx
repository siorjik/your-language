'use client'

import { User2 } from 'lucide-react'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'

import { SetCreatorInfo } from '@/types/models/set'
import Link from 'next/link'
import { getUserAppPath } from '@/utils/paths'
import { useEffect, useState } from 'react'
import { getSetById } from '@/actions/set'
import useDisplayData from '@/hooks/useDisplayData'
import { useQuery } from '@tanstack/react-query'

export default function SetCreator({ setId }: { setId: string }) {
  const [creatorData, setCreatorData] = useState<SetCreatorInfo | null>(null)

  const { data } = useQuery({ queryKey: ['set', setId], queryFn: async () => await getSetById(setId) })

  const { isMobile } = useDisplayData()

  useEffect(() => {
    if (data && !data.error) {
      setCreatorData({
        img: data.creator?.image || data.user!.image,
        createdBy: data.creator?.name || data.user!.name,
        createdAt: data.createdAt,
        id: data.creator?.id || data.user!.id,
      })
    }
  }, [setId, data])

  return (
    <>
      {creatorData?.id ? (
        <Link className="w-fit max-w-36 md:max-w-48 inline-block" href={getUserAppPath(creatorData.id)}>
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
              <span className="truncate leading-normal">
                {!isMobile && 'Created by'} <span className="text-primary font-balsamiqSans">{creatorData.createdBy}</span>,
              </span>
              <span className="truncate leading-normal">{formatDistanceToNow(creatorData.createdAt, { addSuffix: true })}</span>
            </div>
          </div>
        </Link>
      ) : (
        <div className="flex items-center gap-4 animate-pulse">
          <div className="bg-primary/50 h-10 w-10 shrink-0 rounded-full"></div>
          {!isMobile && (
            <div className="w-20 md:w-36 flex flex-col gap-4">
              <div className="bg-primary/50 h-2 w-full rounded-lg"></div>
              <div className="bg-primary/50 h-2 w-4/5 rounded-lg"></div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
