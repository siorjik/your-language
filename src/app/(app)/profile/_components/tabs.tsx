'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import AccForm from './acc-form'
import PassForm from './pass-form'
import ImageForm from './image-form'
import TwoFa from './two-fa'
import Themes from './themes'

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
        <div className="overflow-auto">
          <TabsList className="mb-5">
            <TabsTrigger value="acc">Account</TabsTrigger>
            <TabsTrigger value="pass">Password</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
            <TabsTrigger value="themes">Themes</TabsTrigger>
            <TabsTrigger value="two-fa">Two-Factor Authentication</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="acc">
          <AccForm />
        </TabsContent>
        <TabsContent value="pass">
          <PassForm />
        </TabsContent>
        <TabsContent value="image">
          <ImageForm />
        </TabsContent>
        <TabsContent value="themes">
          <Themes />
        </TabsContent>
        <TabsContent value="two-fa">
          <TwoFa twoFaData={twoFaData} />
        </TabsContent>
      </Tabs>
    </>
  )
}
