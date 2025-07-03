'use client'

import { TrashIcon } from 'lucide-react'
import { motion } from 'framer-motion'

import AlertDialogWrap from '@/components/alert-dialog-wrap'

import { LANGUAGE_OPTIONS } from '@/utils/constants'
import { Set } from '@prisma/client'
import { deleteSet } from '@/actions/set'

export default function SetItem({ set, idx }: { set: Set; idx: number }) {
  return (
    <motion.div
      className="
        px-5 py-3 mt-3 flex gap-5 items-center justify-between overflow-hidden w-full bg-primary/5 shadow-md
        border-b-4 border-b-transparent rounded-b-md hover:border-b-primary/70 transition-colors duration-500
      "
      initial={{ x: idx % 2 === 0 ? +200 : -200, y: 200, opacity: 0.5 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="overflow-hidden">
        <p className="mb-2 text-sm text-primary/60 truncate">
          {(set.list as [])?.length} items | {LANGUAGE_OPTIONS.find((item) => item.value === set.source)?.label + ' / '}
          {LANGUAGE_OPTIONS.find((item) => item.value === set.target)?.label} | author: {':)'}
        </p>
        <p className="truncate text-xl text-primary font-semibold leading-[normal]">{set.title}</p>
      </div>
      <span className="bg-primary/15 icon-hover hover:text-destructive" onClick={(e) => e.preventDefault()}>
        <AlertDialogWrap
          trigger={<TrashIcon />}
          action={async () => await deleteSet(set.id)}
          description="You are going to delete the set..."
        />
      </span>
    </motion.div>
  )
}
