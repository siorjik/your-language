'use client'

import { Fragment } from 'react'
import { GalleryHorizontal, Brain, Pen, BrainCircuit } from 'lucide-react'
import { useTranslations } from 'next-intl'

import Flashcards from './activities/flashcards'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import Memorization from './activities/memorization'
import Spelling from './activities/spelling'

import { ActivityTypesProvider } from '@/contexts/activity-types-context'
import { SelectedSet } from '@/types/models/set'
import Associations from './activities/associations'

export default function TabsPage({ set }: { set: SelectedSet }) {
  const t = useTranslations('activities')

  return (
    <ActivityTypesProvider>
      {!!set ? (
        <Tabs defaultValue="flashcards" className="w-full">
          <TabsList className="w-full mb-5 flex justify-between overflow-x-auto">
            <TabsTrigger className="w-full" value="flashcards">
              <GalleryHorizontal className="mr-2" size={15} />
              {t('flashcards')}
            </TabsTrigger>
            <TabsTrigger className="w-full" value="memorization">
              <Brain className="mr-2" size={15} />
              {t('memorization')}
            </TabsTrigger>
            <TabsTrigger className="w-full" value="spelling">
              <Pen className="mr-2" size={15} />
              {t('spelling')}
            </TabsTrigger>
            <TabsTrigger className="w-full" value="associations">
              <BrainCircuit className="mr-2" size={15} />
              {t('associations')}
            </TabsTrigger>
          </TabsList>
          <Fragment key={set?.id}>
            <TabsContent value="flashcards">
              <Flashcards data={set} />
            </TabsContent>
            <TabsContent value="memorization">
              <Memorization data={set} />
            </TabsContent>
            <TabsContent value="spelling">
              <Spelling data={set} />
            </TabsContent>
            <TabsContent value="associations">
              <Associations data={set} />
            </TabsContent>
          </Fragment>
        </Tabs>
      ) : (
        <p className="sub-title-3 text-center text-warn">
          {t('selectSet')} <span className="emoji">🧐</span>
        </p>
      )}
    </ActivityTypesProvider>
  )
}
