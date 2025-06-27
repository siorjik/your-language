'use client'

import { useEffect, useState } from 'react'

import Flashcards from '@/components/activities/flashcards'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Spinner from '@/components/spinner'
import Memorization from '@/components/activities/memorization'
import Spelling from '@/components/activities/spelling'

import { Set } from '@prisma/client'

export default function TabsPage({ set }: { set: Set }) {
  const [isLoader, setLoader] = useState(false)

  useEffect(() => {
    if (set?.id) {
      setLoader(true)

      setTimeout(() => setLoader(false), 1000)
    }
  }, [set])

  return (
    <>
      {!!set ? (
        <Tabs defaultValue="flashcards" className="w-full">
          <TabsList className="w-full mb-5 flex justify-between">
            <TabsTrigger className="w-full" value="flashcards">
              Flashcards
            </TabsTrigger>
            <TabsTrigger className="w-full" value="memorization">
              Memorization
            </TabsTrigger>
            <TabsTrigger className="w-full" value="spelling">
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
        <p className="sub-title-3 text-center">First choose Set above...</p>
      )}
    </>
  )
}
