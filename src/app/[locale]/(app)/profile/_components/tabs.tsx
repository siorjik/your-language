'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslations } from 'next-intl'

import AccForm from './acc-form'
import PassForm from './pass-form'
import ImageForm from './image-form'
import TwoFa from './two-fa'
import Themes from './themes'

export default function ProfileTabs({
  twoFaData,
  isCredentials,
}: {
  twoFaData: { data: string; secret: string } | null
  isCredentials: boolean
}) {
  const [activeTab, setActiveTab] = useState<null | string>(null)

  const t = useTranslations('Profile')

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
            <TabsTrigger value="acc">{t('tabs.acc')}</TabsTrigger>
            {isCredentials && <TabsTrigger value="pass">{t('tabs.pass')}</TabsTrigger>}
            <TabsTrigger value="image">{t('tabs.image')}</TabsTrigger>
            <TabsTrigger value="colors">{t('tabs.colors')}</TabsTrigger>
            {isCredentials && <TabsTrigger value="two-fa">{t('tabs.two-fa')}</TabsTrigger>}
          </TabsList>
        </div>
        <TabsContent value="acc">
          <AccForm isCredentials={isCredentials} />
        </TabsContent>
        {isCredentials && (
          <TabsContent value="pass">
            <PassForm />
          </TabsContent>
        )}
        <TabsContent value="image">
          <ImageForm />
        </TabsContent>
        <TabsContent value="colors">
          <Themes />
        </TabsContent>
        {isCredentials && (
          <TabsContent value="two-fa">
            <TwoFa twoFaData={twoFaData} />
          </TabsContent>
        )}
      </Tabs>
    </>
  )
}
