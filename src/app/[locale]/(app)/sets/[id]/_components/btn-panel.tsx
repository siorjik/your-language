'use client'

import Link from '@/components/link'
import { GalleryHorizontal, Brain, PanelRightOpen, Pen, FileCog, Trash2, Share, BrainCircuit } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

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
  const t = useTranslations('btn')
  const tPopup = useTranslations('popup')
  const tActivities = useTranslations('activities')
  const tToast = useTranslations('toast.set.delete')

  const onDelete = async () => {
    const res: { success: boolean; error: null } | Err = await deleteSet(id, false)

    if (!res.error) {
      toast({ title: tToast('success.title'), variant: 'success', description: tToast('success.description') })

      setTimeout(() => push(getLocaleUrl(setsAppPath)), 1000)
    } else toast({ title: tToast('destructive.title'), variant: 'destructive', description: res.error.message })
  }

  const navigation = (
    <div>
      <Link className="py-3 flex items-center gap-2 border-b-2 border-accent font-semibold" href={getFlashcardsAppPath(id)}>
        <GalleryHorizontal className="text-primary" size={15} />
        {tActivities('flashcards')}
      </Link>
      <Link className="py-3 flex items-center gap-2 border-b-2 border-accent font-semibold" href={getMemorizationAppPath(id)}>
        <Brain className="text-primary" size={15} />
        {tActivities('memorization')}
      </Link>
      <Link className="py-3 flex items-center gap-2 border-b-2 border-accent font-semibold" href={getSpellingAppPath(id)}>
        <Pen className="text-primary" size={15} />
        {tActivities('spelling')}
      </Link>
      <Link className="py-3 flex items-center gap-2 font-semibold" href={getAssociationsAppPath(id)}>
        <BrainCircuit className="text-primary" size={15} />
        {tActivities('associations')}
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
              {isXlDisplay && t('update')}
            </Link>
          </Button>
          {isCreator && (
            <ShareBtn
              trigger={
                <Button>
                  <Share />
                  {isXlDisplay && t('share')}
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
                  {isXlDisplay && t('delete')}
                </span>
              </Button>
            }
            action={onDelete}
            description={tPopup('deleteSetMess')}
          />
        </div>
      )}
      <SetCreatorComp setId={id} />
      {isLgDisplay ? (
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" className="pushed-btn" asChild>
            <Link href={getFlashcardsAppPath(id)}>
              <GalleryHorizontal />
              {tActivities('flashcards')}
            </Link>
          </Button>
          <Button variant="outline" className="pushed-btn" asChild>
            <Link href={getMemorizationAppPath(id)}>
              <Brain />
              {tActivities('memorization')}
            </Link>
          </Button>
          <Button variant="outline" className="pushed-btn" asChild>
            <Link href={getSpellingAppPath(id)}>
              <Pen />
              {tActivities('spelling')}
            </Link>
          </Button>
          <Button variant="outline" className="pushed-btn col-start-2" asChild>
            <Link href={getAssociationsAppPath(id)}>
              <BrainCircuit />
              {tActivities('associations')}
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
