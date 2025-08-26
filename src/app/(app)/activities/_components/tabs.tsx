'use client'

import { useEffect, useState, Fragment } from 'react'
import { GalleryHorizontal, Brain, Pen } from 'lucide-react'

import Flashcards from '@/components/activities/flashcards'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Spinner from '@/components/spinner'
import Memorization from '@/components/activities/memorization'
import Spelling from '@/components/activities/spelling'

import { ActivityTypesProvider } from '@/contexts/activity-types-context'
import { SelectedSet } from '@/types/models/set'

export default function TabsPage({ set, isComboOpen }: { set: SelectedSet; isComboOpen: boolean }) {
  const [isLoader, setLoader] = useState(false)
  const [setId, setSetId] = useState('')

  useEffect(() => {
    if (set?.id !== setId) {
      setLoader(true)

      setTimeout(() => {
        setLoader(false)
        setSetId(set?.id)
      }, 500)
    }
  }, [setId, set])

  return (
    <ActivityTypesProvider>
      {!!set ? (
        <Tabs defaultValue="flashcards" className="w-full">
          <TabsList className="w-full mb-5 flex justify-between overflow-x-auto">
            <TabsTrigger className="w-full" value="flashcards">
              <GalleryHorizontal className="mr-2" size={15} />
              Flashcards
            </TabsTrigger>
            <TabsTrigger className="w-full" value="memorization">
              <Brain className="mr-2" size={15} />
              Memorization
            </TabsTrigger>
            <TabsTrigger className="w-full" value="spelling">
              <Pen className="mr-2" size={15} />
              Spelling
            </TabsTrigger>
          </TabsList>
          {isLoader ? (
            <Spinner />
          ) : (
            <Fragment key={set?.id}>
              <TabsContent value="flashcards">
                <Flashcards data={set} isComboOpen={isComboOpen} />
              </TabsContent>
              <TabsContent value="memorization">
                <Memorization data={set} />
              </TabsContent>
              <TabsContent value="spelling">
                <Spelling data={set} />
              </TabsContent>
            </Fragment>
          )}
        </Tabs>
      ) : (
        <p className="sub-title-3 text-center text-warn">
          First select Set above <span className="emoji">🧐</span>
        </p>
      )}
    </ActivityTypesProvider>
  )
}
