'use client'

import SetList from '@/components/set-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { SelectedSet } from '@/types/models/set'

export default function UserTabs({ sets, isOwner = true }: { sets: SelectedSet[]; isOwner?: boolean }) {
  return (
    <>
      <Tabs defaultValue="sets" className="w-full">
        <TabsList className="w-full mb-5 flex justify-between overflow-x-auto">
          <TabsTrigger className="w-full" value="sets">
            Sets
          </TabsTrigger>
          <TabsTrigger className="w-full" value="classes">
            Classes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="sets">
          <div className={`${!isOwner ? 'mt-[-25px]' : ''}`}>
            <SetList sets={sets} isOwner={isOwner} />
          </div>
        </TabsContent>
        <TabsContent value="classes">
          <h2 className="sub-title-3">In progress 🙄...</h2>
        </TabsContent>
      </Tabs>
    </>
  )
}
