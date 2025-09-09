'use client'

import { Share, TrashIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

import AlertDialogWrap from '@/components/alert-dialog-wrap'
import ShareBtn from '@/components/share-btn'

import { LANGUAGE_OPTIONS, SOCKET_EVENTS } from '@/utils/constants'
import { deleteSet } from '@/actions/set'
import { SelectedSet } from '@/types/models/set'
import useSocket from '@/hooks/useSocket'
import { getUserAppPath } from '@/utils/paths'

export default function SetItem({
  set,
  idx,
  isCreator = true,
  isSetCreator = true,
}: {
  set: SelectedSet
  idx: number
  isCreator?: boolean
  isSetCreator?: boolean
}) {
  const creator = !!set.creatorId ? set.creator : set.user

  const { eventEmit } = useSocket(SOCKET_EVENTS.notification)
  const { push } = useRouter()

  return (
    <motion.div
      className="
        px-5 pt-3 pb-2 mt-3 flex gap-5 items-center justify-between w-full bg-primary/5 shadow-md
        border-b-4 border-b-transparent rounded-b-md hover:border-b-primary/70 transition-colors duration-500
      "
      initial={{ x: idx % 2 === 0 ? +200 : -200, y: 200, opacity: 0.5 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 80 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="overflow-hidden">
        <div className="mb-1 text-sm text-primary/60 truncate">
          {(set.list as [])?.length} items <span className="font-semibold text-primary">|</span>{' '}
          {format(set.createdAt, 'MM/yyyy')} <span className="font-semibold text-primary">|</span>{' '}
          {LANGUAGE_OPTIONS.find((item) => item.value === set.source)?.label + ' / '}
          {LANGUAGE_OPTIONS.find((item) => item.value === set.target)?.label}{' '}
          <span className="font-semibold text-primary">|</span>{' '}
          <div
            className="pr-1 hover:bg-primary/30 rounded-lg duration-300 inline-block"
            onClick={(e) => {
              e.preventDefault()

              push(getUserAppPath(creator!.id))
            }}
          >
            {creator?.image && (
              <>
                <Image
                  src={creator.image}
                  alt="user"
                  width={10}
                  height={10}
                  className="w-5 h-5 rounded-full relative bottom-[1px] inline object-cover"
                  priority
                />{' '}
              </>
            )}
            <span className="text-primary font-balsamiqSans text-base">{creator?.name}</span>
          </div>
        </div>
        <p className="truncate text-xl text-primary font-balsamiqSans leading-none">{set.title}</p>
      </div>
      <div className="flex gap-2">
        {isSetCreator && isCreator && (
          <ShareBtn
            trigger={
              <span className="bg-primary/15 icon-hover">
                <Share size={20} />
              </span>
            }
            id={set.id}
            isDouble
          />
        )}
        {isCreator && (
          <span className="bg-primary/15 icon-hover hover:text-destructive" onClick={(e) => e.preventDefault()}>
            <AlertDialogWrap
              trigger={<TrashIcon size={20} />}
              action={async () => {
                await deleteSet(set.id)

                eventEmit()
              }}
              description="You are going to delete the Set..."
            />
          </span>
        )}
      </div>
    </motion.div>
  )
}
