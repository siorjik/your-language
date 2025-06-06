'use client'

import { useState } from 'react'
import { TrashIcon } from 'lucide-react'
import { motion } from 'framer-motion'

import AlertDialogWrap from '@/components/alert-dialog-wrap'

import { LANGUAGE_OPTIONS } from '@/utils/constants'
import { Set } from '@prisma/client'
import { deleteSet } from '@/actions/set'

export default function SetItem({ set }: { set: Set }) {
  const [isPointEvents, setPointEvents] = useState(false) // to make pointer-event-none from the animation start

  return (
    <motion.div
      className={`
        w-full pointer-events-none hover:scale-[1.02] border-b-4 border-b-transparent rounded-b-md hover:border-b-primary/70
        ${isPointEvents ? 'pointer-events-auto' : 'pointer-events-none'} duration-500
      `}
      animate={{ background: 'transparent' }} // just for animation triggering to switch pointer-events-auto after complete
      onAnimationComplete={() => setTimeout(() => setPointEvents(!isPointEvents), 500)}
    >
      <motion.div
        className="px-5 py-3 mt-2 flex gap-5 items-center justify-between overflow-hidden w-full bg-primary/5 shadow-md"
        initial={{ y: -300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        <div className="overflow-hidden">
          <p className="mb-2 text-sm text-muted-foreground truncate">
            {(set.list as [])?.length} items | from: {LANGUAGE_OPTIONS.find((item) => item.value === set.source)?.label + ' '}
            to: {LANGUAGE_OPTIONS.find((item) => item.value === set.target)?.label} | author: {':)'}
          </p>
          <p className="truncate text-xl font-semibold leading-[normal]">{set.title}</p>
        </div>
        <span className="bg-secondary/20 icon-hover hover:text-destructive" onClick={(e) => e.preventDefault()}>
          <AlertDialogWrap
            trigger={<TrashIcon />}
            action={async () => await deleteSet(set.id)}
            description="You are going to delete the set..."
          />
        </span>
      </motion.div>
    </motion.div>
  )
}
