'use client'

import Link from 'next/link'
import { GalleryHorizontal, Brain, PanelRightOpen, Pen, FileCog, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import SheetWrap from '@/components/sheet-wrap'
import AlertDialogWrap from '@/components/alert-dialog-wrap'

import { getFlashcardsAppPath, getMemorizationAppPath, getSpellingAppPath, getUpdateSetAppPath, setsAppPath } from '@/utils/paths'
import useDisplayData from '@/hooks/useDisplayData'
import { deleteSet } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { useToast } from '@/hooks/use-toast'

export default function NavPanel({ id }: { id: string }) {
  const { isMobile } = useDisplayData()

  const { push } = useRouter()
  const { toast } = useToast()

  const onDelete = async () => {
    const res: { success: boolean; error: null } | Err = await deleteSet(id, false)

    if (!res.error) {
      toast({ title: 'Set deleting', variant: 'success', description: 'Set was deleted successfully!' })

      setTimeout(() => push(setsAppPath), 1000)
    }
  }

  const navigation = (
    <div>
      <Link className="py-3 flex gap-2 border-b-2 border-accent" href={getFlashcardsAppPath(id)}>
        <GalleryHorizontal size={15} />
        Flashcards
      </Link>
      <Link className="py-3 flex gap-2 border-b-2 border-accent" href={getMemorizationAppPath(id)}>
        <Brain size={15} />
        Memorization
      </Link>
      <Link className="py-3 flex gap-2" href={getSpellingAppPath(id)}>
        <Pen size={15} />
        Spelling
      </Link>
    </div>
  )

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <Button asChild>
          <Link href={getUpdateSetAppPath(id)}>
            <FileCog />
            Update
          </Link>
        </Button>
        <AlertDialogWrap
          trigger={
            <Button asChild>
              <span>
                <Trash2 />
                Remove
              </span>
            </Button>
          }
          action={onDelete}
          description="You are going to delete the set..."
        />
      </div>
      {!isMobile ? (
        <div className="flex gap-2">
          <Button variant="outline" className="pushed-btn" asChild>
            <Link href={getFlashcardsAppPath(id)}>
              <GalleryHorizontal />
              Flashcards
            </Link>
          </Button>
          <Button variant="outline" className="pushed-btn" asChild>
            <Link href={getMemorizationAppPath(id)}>
              <Brain />
              Memorization
            </Link>
          </Button>
          <Button variant="outline" className="pushed-btn" asChild>
            <Link href={getSpellingAppPath(id)}>
              <Pen />
              Spelling
            </Link>
          </Button>
        </div>
      ) : (
        <SheetWrap
          trigger={
            <span className="text-primary">
              <PanelRightOpen size={30} />
            </span>
          }
          content={navigation}
        />
      )}
    </div>
  )
}
