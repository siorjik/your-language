'use client'

import Link from '@/components/link'
import { GalleryHorizontal, Brain, PanelRightOpen, Pen, FileCog, Trash2, Share, BrainCircuit } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import SheetWrap from '@/components/sheet-wrap'
import AlertDialogWrap from '@/components/alert-dialog-wrap'
import ShareBtn from '@/components/share-btn'
import SetCreatorComp from '@/components/set-creator'

import {
  getAssociationsAppPath,
  getFlashcardsAppPath,
  getMemorizationAppPath,
  getSpellingAppPath,
  getUpdateSetAppPath,
  setsAppPath,
} from '@/utils/paths'
import useDisplayData from '@/hooks/useDisplayData'
import { deleteSet } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { useToast } from '@/hooks/use-toast'
import useLocaleUrl from '@/hooks/use-locale-url'

type NavPanelProps = { id: string; isCreator: boolean; isOwner: boolean }

export default function NavPanel({ id, isCreator, isOwner }: NavPanelProps) {
  const { isLgDisplay, isXlDisplay } = useDisplayData()

  const { push } = useRouter()
  const { toast } = useToast()
  const { getLocaleUrl } = useLocaleUrl()

  const onDelete = async () => {
    const res: { success: boolean; error: null } | Err = await deleteSet(id, false)

    if (!res.error) {
      toast({ title: 'Set Deleting', variant: 'success', description: 'Set was deleted successfully!' })

      setTimeout(() => push(getLocaleUrl(setsAppPath)), 1000)
    }
  }

  const navigation = (
    <div>
      <Link className="py-3 flex items-center gap-2 border-b-2 border-accent font-semibold" href={getFlashcardsAppPath(id)}>
        <GalleryHorizontal className="text-primary" size={15} />
        Flashcards
      </Link>
      <Link className="py-3 flex items-center gap-2 border-b-2 border-accent font-semibold" href={getMemorizationAppPath(id)}>
        <Brain className="text-primary" size={15} />
        Memorization
      </Link>
      <Link className="py-3 flex items-center gap-2 border-b-2 border-accent font-semibold" href={getSpellingAppPath(id)}>
        <Pen className="text-primary" size={15} />
        Spelling
      </Link>
      <Link className="py-3 flex items-center gap-2 font-semibold" href={getAssociationsAppPath(id)}>
        <BrainCircuit className="text-primary" size={15} />
        Associations
      </Link>
    </div>
  )

  return (
    <div className="flex gap-5 justify-between items-center">
      {isOwner && (
        <div className="flex gap-2">
          <Button asChild>
            <Link href={getUpdateSetAppPath(id)}>
              <FileCog />
              {isXlDisplay && 'Update'}
            </Link>
          </Button>
          {isCreator && (
            <ShareBtn
              trigger={
                <Button>
                  <Share />
                  {isXlDisplay && 'Share'}
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
                  {isXlDisplay && 'Remove'}
                </span>
              </Button>
            }
            action={onDelete}
            description="You are going to delete the Set..."
          />
        </div>
      )}
      <SetCreatorComp setId={id} />
      {isLgDisplay ? (
        <div className="grid grid-cols-3 gap-2">
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
          <Button variant="outline" className="pushed-btn col-start-2" asChild>
            <Link href={getAssociationsAppPath(id)}>
              <BrainCircuit />
              Associations
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
