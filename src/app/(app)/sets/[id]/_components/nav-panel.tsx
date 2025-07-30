'use client'

import Link from 'next/link'
import { GalleryHorizontal, Brain, PanelRightOpen, Pen, FileCog, Trash2, Share } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import SheetWrap from '@/components/sheet-wrap'
import AlertDialogWrap from '@/components/alert-dialog-wrap'
import ShareBtn from '@/components/share-btn'

import { getFlashcardsAppPath, getMemorizationAppPath, getSpellingAppPath, getUpdateSetAppPath, setsAppPath } from '@/utils/paths'
import useDisplayData from '@/hooks/useDisplayData'
import { deleteSet } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { useToast } from '@/hooks/use-toast'

export default function NavPanel({ id, isOwnerExist }: { id: string; isOwnerExist: boolean }) {
  const { isLgDisplay, isMobile } = useDisplayData()

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
      <Link className="py-3 flex items-center gap-2 border-b-2 border-accent font-semibold" href={getFlashcardsAppPath(id)}>
        <GalleryHorizontal size={15} />
        Flashcards
      </Link>
      <Link className="py-3 flex items-center gap-2 border-b-2 border-accent font-semibold" href={getMemorizationAppPath(id)}>
        <Brain size={15} />
        Memorization
      </Link>
      <Link className="py-3 flex items-center gap-2 font-semibold" href={getSpellingAppPath(id)}>
        <Pen size={15} />
        Spelling
      </Link>
    </div>
  )

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        {!isOwnerExist && (
          <Button asChild>
            <Link href={getUpdateSetAppPath(id)}>
              <FileCog />
              {!isMobile && 'Update'}
            </Link>
          </Button>
        )}
        {!isOwnerExist && (
          <ShareBtn
            trigger={
              <Button>
                <Share />
                {!isMobile && 'Share'}
              </Button>
            }
            id={id}
          />
        )}
        <AlertDialogWrap
          trigger={
            <Button variant="destructive" asChild>
              <span>
                <Trash2 />
                {!isMobile && 'Remove'}
              </span>
            </Button>
          }
          action={onDelete}
          description="You are going to delete the set..."
        />
      </div>
      {isLgDisplay ? (
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
