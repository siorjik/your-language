'use client'

import { useEffect, useState } from 'react'
import { GalleryHorizontal, Brain, Pen } from 'lucide-react'

import Flashcards from '@/components/activities/flashcards'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Spinner from '@/components/spinner'
import Memorization from '@/components/activities/memorization'
import Spelling from '@/components/activities/spelling'

import { Set } from '@prisma/client'
import { ActivityTypesProvider } from '@/contexts/activity-types-context'

export default function TabsPage({ set }: { set: Set }) {
  const [isLoader, setLoader] = useState(false)

  useEffect(() => {
    if (set?.id) {
      setLoader(true)

      setTimeout(() => setLoader(false), 500)
    }
  }, [set])

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
            <>
              <TabsContent value="flashcards">
                <Flashcards key={set.id} data={set} />
              </TabsContent>
              <TabsContent value="memorization">
                <Memorization key={set.id} data={set} />
              </TabsContent>
              <TabsContent value="spelling">
                <Spelling key={set.id} data={set} />
              </TabsContent>
            </>
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
