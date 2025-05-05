'use client'

import { TrashIcon } from 'lucide-react'

import AlertDialogWrap from '@/components/alert-dialog-wrap'

import { languageOptions } from '@/utils/constants'
import { Set } from '@prisma/client'
import { deleteSet } from '@/actions/set'

export default function SetItem({ set }: { set: Set }) {
  return (
    <>
      <div
        className="
          px-5 py-3 mt-2 flex gap-5 items-center justify-between border border-slate-200 rounded-lg hover:bg-slate-50
          dark:hover:bg-slate-700 hover:scale-[1.01] transition-all duration-500 overflow-hidden
        "
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
      </div>
    </>
  )
}
