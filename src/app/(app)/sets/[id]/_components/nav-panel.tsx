'use client'

import Link from 'next/link'
import { GalleryHorizontal, BrainCircuit, PanelRightOpen, FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { getFlashcardsAppPath, getMemorizationAppPath, getSpellingAppPath } from '@/utils/paths'
import useDisplayData from '@/hooks/useDisplayData'
import SheetWrap from '@/components/sheet-wrap'

export default function NavPanel({ id }: { id: string }) {
  const { isMobile } = useDisplayData()

  const navigation = (
    <div>
      <Link className="py-3 flex gap-2 border-b-2 border-accent" href={getFlashcardsAppPath(id)}>
        <GalleryHorizontal size={15} />
        Flashcards
      </Link>
      <Link className="py-3 flex gap-2 border-b-2 border-accent" href={getMemorizationAppPath(id)}>
        <BrainCircuit size={15} />
        Memorization
      </Link>
      <Link className="py-3 flex gap-2" href={getSpellingAppPath(id)}>
        <FileText size={15} />
        Spelling
      </Link>
    </div>
  )

  return (
    <>
      {!isMobile ? (
        <>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={getFlashcardsAppPath(id)}>
                <GalleryHorizontal />
                Flashcards
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={getMemorizationAppPath(id)}>
                <BrainCircuit />
                Memorization
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={getSpellingAppPath(id)}>
                <FileText />
                Spelling
              </Link>
            </Button>
          </div>
        </>
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
    </>
  )
}
