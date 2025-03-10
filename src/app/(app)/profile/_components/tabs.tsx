'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import AccForm from './acc-form'
import PassForm from './pass-form'
import ImageForm from './image-form'
import TwoFa from './two-fa'

export default function ProfileTabs({ twoFaData }: { twoFaData: { data: string; secret: string } | null }) {
  const [activeTab, setActiveTab] = useState<null | string>(null)

  useEffect(() => {
    if (activeTab) window.localStorage.setItem('tab', activeTab)
  }, [activeTab])

  useEffect(() => {
    setActiveTab(window.localStorage.getItem('tab') || 'acc')
  }, [])

  return (
    <>
      <Tabs value={activeTab!} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="acc">Account</TabsTrigger>
          <TabsTrigger value="pass">Password</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
          <TabsTrigger value="two-fa">Two-Factor Authentication</TabsTrigger>
        </TabsList>
        <TabsContent value="acc">
          <div className="mt-10">
            <AccForm />
          </div>
        </TabsContent>
        <TabsContent value="pass">
          <div className="mt-10">
            <PassForm />
          </div>
        </TabsContent>
        <TabsContent value="image">
          <div className="mt-10">
            <ImageForm />
          </div>
        </TabsContent>
        <TabsContent value="two-fa">
          <div className="mt-10">
            <TwoFa twoFaData={twoFaData} />
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
