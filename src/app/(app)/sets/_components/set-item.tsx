'use client'

import { Set } from '@prisma/client'
import { TrashIcon } from 'lucide-react'

export default function SetItem({ set }: { set: Set }) {
  const handleDelete = (e: React.MouseEvent<SVGSVGElement>, id: string) => {
    e.preventDefault()

    console.log(id)
  }

  return (
    <div className="p-5 mt-2 flex gap-5 items-center justify-between border border-slate-200 rounded-lg hover:bg-slate-100">
      <div>
        <span className="text-sm">{(set.list as [])?.length} items</span> | {set.title}
      </div>
      <TrashIcon onClick={(e) => handleDelete(e, set.id)} />
    </div>
  )
}
