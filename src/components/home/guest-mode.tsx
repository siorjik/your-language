'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import DialogWrap from '../dialog-wrap'
import SignInForm from '../forms/sign-in-form'
import SignUpForm from '../forms/sign-up-form'
import { Button } from '../ui/button'
import HeroSection from './hero-section'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card'
import { GlowEffect } from '../ui/glow-effect'
import { TextShimmerWave } from '../ui/text-shimmer-wave'

import flashcardsImg from '@/../public/flashcards.png'
import deviceImg from '@/../public/devices.png'
import chartImg from '@/../public/chart.png'

import useDisplayData from '@/hooks/useDisplayData'

export default function GuestMode() {
  const [isClose, setClose] = useState(false)

  const { theme } = useTheme()
  const { isLgDisplay, viewSize } = useDisplayData()
  const t = useTranslations('Home.guestMode')
  const tCommon = useTranslations('common')

  const isDark = theme?.includes('-dark')

  const dialogContent = (
    <Tabs>
      <TabsList className="w-full flex justify-evenly">
        <TabsTrigger value="signIn" className="w-1/2">
          {tCommon('signIn')}
        </TabsTrigger>
        <TabsTrigger value="signUp" className="w-1/2">
          {tCommon('signUp')}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="signIn">
        <div className="mt-5 flex justify-center">
          <SignInForm />
        </div>
      </TabsContent>
      <TabsContent value="signUp">
        <div className="mt-5 flex justify-center">
          <SignUpForm
            isMainPage
            onSuccess={() => {
              setClose(true)

              setTimeout(() => setClose(false), 500)
            }}
          />
        </div>
      </TabsContent>
    </Tabs>
  )

  const getDialog = (text: string) => (
    <DialogWrap
      width="max-w-[400px]"
      title={
        <p>
          {t('welcomePopup')} <span className="emoji">👋</span>
        </p>
      }
      trigger={
        <div className="relative">
          <GlowEffect className="rounded-md" mode="rotate" blur="soft" duration={5} scale={1} />
          <Button className={`m-1 p-6 text-lg relative ${isDark ? 'brightness-50' : ''}`}>{text}</Button>
        </div>
      }
      content={dialogContent}
      isAutoClose={isClose}
    />
  )

  return (
    <>
      <HeroSection dialogContent={dialogContent} isClose={isClose} />
      <div className="min-h-[calc(100dvh-50px)] pt-10 pb-5 flex justify-center items-center">
        <div className="flex flex-wrap gap-6 justify-center items-center">
          {viewSize && (
            <motion.div
              initial={{ opacity: 0, y: isLgDisplay ? 200 : 0, scaleY: 0.5, rotateY: 150 }}
              whileInView={{ opacity: 1, y: 0, scaleY: 1, rotateY: 0 }}
              viewport={{ once: !isLgDisplay }}
              transition={{ duration: 0.5 }}
            >
              <Card className="lg:min-h-[850px] flex flex-col justify-between bg-secondary/50 border-0 shadow-xl text-center">
                <div>
                  <CardHeader>
                    <CardTitle className="font-balsamiqSans text-primary/50">
                      <TextShimmerWave
                        className="[--base-color:hsla(var(--primary))] [--base-gradient-color:hsla(var(--secondary))]"
                        duration={1}
                        scaleDistance={1.3}
                        rotateYDistance={20}
                      >
                        {t('flashcardsQuizzes')}
                      </TextShimmerWave>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="
                        max-w-[350px] mx-auto mb-8 p-3 italic font-semibold text-muted-foreground relative
                      "
                    >
                      <GlowEffect className="rounded-lg opacity-40" mode="flowHorizontal" blur="softest" duration={5} scale={1} />
                      {t.rich('flashcardsQuizzesText', { span: (text) => <span className="text-primary">{text}</span> })}
                    </div>
                    <Image
                      src={flashcardsImg}
                      alt="flash-cards"
                      width={300}
                      height={300}
                      className={`mx-auto mb-5 ${isDark ? 'brightness-50' : ''}`}
                      priority
                    />
                  </CardContent>
                </div>
                <CardFooter>
                  <span className="mx-auto">{getDialog(t('createFlashcards'))}</span>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {viewSize && (
            <motion.div
              initial={{ opacity: 0, y: isLgDisplay ? 250 : 0, scaleY: 0.5, rotateY: 150 }}
              whileInView={{ opacity: 1, y: 0, scaleY: 1, rotateY: 0 }}
              viewport={{ once: !isLgDisplay }}
              transition={{ duration: 0.5, delay: 1.5 * 0.1 }}
            >
              <Card className="lg:min-h-[850px] flex flex-col justify-between bg-secondary/50 border-0 shadow-xl text-center">
                <div>
                  <CardHeader>
                    <CardTitle className="font-balsamiqSans text-primary/50">
                      <TextShimmerWave
                        className="[--base-color:hsla(var(--primary))] [--base-gradient-color:hsla(var(--secondary))]"
                        duration={1}
                        scaleDistance={1.3}
                        rotateYDistance={20}
                      >
                        {t('activityTracker')}
                      </TextShimmerWave>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="
                        max-w-[350px] mx-auto mb-4 p-3 italic font-semibold text-muted-foreground relative
                      "
                    >
                      <GlowEffect className="rounded-lg opacity-40" mode="flowHorizontal" blur="softest" duration={5} scale={1} />
                      {t.rich('activityTrackerText', { span: (text) => <span className="text-primary">{text}</span> })}
                    </div>
                    <Image
                      src={chartImg}
                      alt="flash-cards"
                      width={300}
                      height={300}
                      className={`mx-auto mb-1 ${isDark ? 'brightness-50' : ''}`}
                      priority
                    />
                  </CardContent>
                </div>
                <CardFooter>
                  <span className="mx-auto">{getDialog(t('startActivity'))}</span>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {viewSize && (
            <motion.div
              initial={{ opacity: 0, y: isLgDisplay ? 300 : 0, scaleY: 0.5, rotateY: 150 }}
              whileInView={{ opacity: 1, y: 0, scaleY: 1, rotateY: 0 }}
              viewport={{ once: !isLgDisplay }}
              transition={{ duration: 0.5, delay: 2 * 0.1 }}
            >
              <Card className="lg:min-h-[850px] flex flex-col justify-between bg-secondary/50 border-0 shadow-xl text-center">
                <div>
                  <CardHeader>
                    <CardTitle className="font-balsamiqSans text-primary/50">
                      <TextShimmerWave
                        className="[--base-color:hsla(var(--primary))] [--base-gradient-color:hsla(var(--secondary))]"
                        duration={1}
                        scaleDistance={1.3}
                        rotateYDistance={20}
                      >
                        {t('accessibility')}
                      </TextShimmerWave>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="
                        max-w-[350px] mx-auto mb-3 p-3 italic font-semibold text-muted-foreground relative
                      "
                    >
                      <GlowEffect className="rounded-lg opacity-40" mode="flowHorizontal" blur="softest" duration={5} scale={1} />
                      {t.rich('accessibilityText', { span: (text) => <span className="text-primary">{text}</span> })}
                    </div>
                    <Image
                      src={deviceImg}
                      alt="flash-cards"
                      width={300}
                      height={300}
                      className={`mx-auto ${isDark ? 'brightness-50' : ''}`}
                      priority
                    />
                  </CardContent>
                </div>
                <CardFooter>
                  <span className="mx-auto">{getDialog(t('startLearning'))}</span>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}
