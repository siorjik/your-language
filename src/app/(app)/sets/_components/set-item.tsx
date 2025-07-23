'use client'

import { Share, TrashIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

import AlertDialogWrap from '@/components/alert-dialog-wrap'

import { LANGUAGE_OPTIONS } from '@/utils/constants'
import { deleteSet } from '@/actions/set'
import { SelectedSet } from '@/types/models/set'
import useFileStorage from '@/hooks/useFileStorage'
import ShareBtn from '@/components/share-btn'

export default function SetItem({ set, idx }: { set: SelectedSet; idx: number }) {
  const { getAuthUrl } = useFileStorage()

  const isOwnerExist = !!set.ownerId

  return (
    <motion.div
      className="
        px-5 pt-3 pb-2 mt-3 flex gap-5 items-center justify-between w-full bg-primary/5 shadow-md
        border-b-4 border-b-transparent rounded-b-md hover:border-b-primary/70 transition-colors duration-500
      "
      initial={{ x: idx % 2 === 0 ? +200 : -200, y: 200, opacity: 0.5 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="overflow-hidden">
        <p className="mb-2 text-sm text-primary/60 truncate">
          {(set.list as [])?.length} items <span className="font-semibold text-primary">|</span>{' '}
          {LANGUAGE_OPTIONS.find((item) => item.value === set.source)?.label + ' / '}
          {LANGUAGE_OPTIONS.find((item) => item.value === set.target)?.label}{' '}
          <span className="font-semibold text-primary">|</span>{' '}
          {set.user.image && (
            <>
              <Image
                src={getAuthUrl(isOwnerExist ? set.owner!.image! : set.user.image)}
                alt="user"
                width={10}
                height={10}
                className="w-5 h-5 rounded-full relative bottom-[1px] inline object-cover"
                priority
              />{' '}
            </>
          )}
          <span className="text-primary font-balsamiqSans">{isOwnerExist ? set.owner!.name : set.user.name}</span>
        </p>
        <p className="truncate text-xl text-primary font-balsamiqSans leading-none">{set.title}</p>
      </div>
      <div className="flex gap-2">
        {!isOwnerExist && (
          <ShareBtn
            trigger={
              <span className="bg-primary/15 icon-hover">
                <Share size={20} />
              </span>
            }
            id={set.id}
          />
        )}
        <span className="bg-primary/15 icon-hover hover:text-destructive" onClick={(e) => e.preventDefault()}>
          <AlertDialogWrap
            trigger={<TrashIcon size={20} />}
            action={async () => await deleteSet(set.id)}
            description="You are going to delete the set..."
          />
        </span>
      </div>
    </motion.div>
  )
}
