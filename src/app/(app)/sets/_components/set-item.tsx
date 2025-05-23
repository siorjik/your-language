'use client'

import { TrashIcon } from 'lucide-react'
import { motion } from 'framer-motion'

import AlertDialogWrap from '@/components/alert-dialog-wrap'

import { languageOptions } from '@/utils/constants'
import { Set } from '@prisma/client'
import { deleteSet } from '@/actions/set'

export default function SetItem({ set }: { set: Set }) {
  return (
    <>
      <motion.div
        className="
          px-5 py-3 mt-2 flex gap-5 items-center justify-between border border-primary rounded-lg
          hover:bg-secondary overflow-hidden
        "
        initial={{ y: -300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, type: 'spring', stiffness: 400 }}
        whileHover={{ scale: 1.01 }}
      >
        <div className="overflow-hidden">
          <p className="mb-[2px] text-sm text-muted-foreground truncate">
            {(set.list as [])?.length} items | from: {languageOptions.find((item) => item.value === set.source)?.label + ' '}
            to: {languageOptions.find((item) => item.value === set.target)?.label}
          </p>{' '}
          <p className="truncate text-lg">{set.title}</p>
        </div>
        <span className="hover:text-orange-400" onClick={(e) => e.preventDefault()}>
          <AlertDialogWrap
            trigger={<TrashIcon />}
            action={async () => await deleteSet(set.id)}
            description="You are going to delete the set..."
          />
        </span>
      </motion.div>
    </>
  )
}
