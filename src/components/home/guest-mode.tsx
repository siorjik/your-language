'use client'

import { useState } from 'react'
import Image from 'next/image'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import DialogWrap from '../dialog-wrap'
import SignInForm from '../forms/sign-in-form'
import SignUpForm from '../forms/sign-up-form'
import { Button } from '../ui/button'
import HeroSection from './hero-section'

import useDisplayData from '@/hooks/useDisplayData'

import flashcardsImg from '@/../public/flashcards.jpg'

export default function GuestMode() {
  const [isClose, setClose] = useState(false)

  const { viewSize } = useDisplayData()

  const dialogContent = (
    <Tabs>
      <TabsList className="w-full flex justify-evenly">
        <TabsTrigger value="signIn" className="w-1/2">
          Sign In
        </TabsTrigger>
        <TabsTrigger value="signUp" className="w-1/2">
          Sign Up
        </TabsTrigger>
      </TabsList>
      <TabsContent value="signIn">
        <div className="mt-5 flex justify-center">
          <SignInForm />
        </div>
      </TabsContent>
      <TabsContent value="signUp">
        <div className="mt-5 flex justify-center">
          <SignUpForm isMainPage onSuccess={() => setClose(true)} />
        </div>
      </TabsContent>
    </Tabs>
  )

  const getDialog = (text: string) => (
    <DialogWrap
      width="max-w-[400px]"
      title={
        <p>
          Welcome! <span className="emoji">👋</span>
        </p>
      }
      trigger={
        <Button variant="outline" className="p-5 text-primary hover:border-primary hover:bg-initial bg-animated">
          {text}
        </Button>
      }
      content={dialogContent}
      isAutoClose={isClose}
    />
  )

  return (
    <>
      <HeroSection dialogContent={dialogContent} isClose={isClose} />
      <div className='flex flex-col items-center'>
        <div className="min-h-[calc(100vh-50px)] p-5 bg-primary/30 flex flex-col md:flex-row gap-10 items-center justify-evenly" style={{ width: `${viewSize}px` }}>
          <Image src={flashcardsImg} alt="flash-cards" width={300} height={300} priority />
          <div className="text-center text-muted-foreground">
            <h3 className="sub-title-1 mb-5 text-primary/50">Flashcards & Quizzes</h3>
            <p className="max-w-[500px] mx-auto mb-5 p-3 bg-muted rounded-lg italic font-semibold">
              Master new words and phrases faster than ever with our <span className="text-primary">Flashcards & Quizzes</span>.
              Effortlessly review vocabulary in bite-sized sessions, then challenge yourself with quick quizzes that keep your
              memory sharp. Flashcards help you visualize, repeat, and retain essential language, while quizzes turn learning into
              an engaging game. Whether you have just a few minutes or a whole hour, these tools adapt to your pace and keep you
              motivated. Explore, practice, and grow your English skills - all in one place.
            </p>
            {getDialog('Create Flashcards')}
          </div>
        </div>

        <div className="min-h-[calc(100vh-50px)] p-5 bg-primary/20 flex flex-col-reverse md:flex-row gap-10 items-center justify-evenly" style={{ width: `${viewSize}px` }}>
          <div className="text-center text-muted-foreground">
            <h3 className="sub-title-1 mb-5 text-primary/50">Your Personal Activity Tracker</h3>
            <p className="max-w-[500px] mx-auto mb-5 p-3 bg-muted rounded-lg italic font-semibold">
              Stay on top of your progress with <span className="text-primary">Your Personal Activity Tracker</span>. See how much
              you’ve learned, track your daily practice, and celebrate every milestone. From completed flashcards to quiz scores and
              study streaks, your tracker keeps everything organized in one place. It`s the easiest way to stay motivated, set
              goals, and watch your English skills grow step by step. Learning is a journey - let your activity tracker guide the
              way!
            </p>
            {getDialog('Make Activity')}
          </div>
          <Image src={flashcardsImg} alt="flash-cards" width={300} height={300} priority />
        </div>

        <div className="min-h-[calc(100vh-50px)] p-5 flex flex-col md:flex-row gap-10 items-center justify-evenly" style={{ width: `${viewSize}px` }}>
          <Image src={flashcardsImg} alt="flash-cards" width={300} height={300} priority />
          <div className="text-center text-muted-foreground">
            <h3 className="sub-title-1 mb-5 text-primary/50">Accessible Anywhere</h3>
            <p className="max-w-[500px] mx-auto mb-5 p-3 bg-muted rounded-lg italic font-semibold">
              With <span className="text-primary font-semibold">Accessible Anywhere</span>, your language learning goes wherever you
              go. Whether you`re on your phone, tablet, or computer, all your flashcards, quizzes, and progress are always synced
              and ready. Practice on the bus, at the café, or from the comfort of home - your learning is never limited by location.
              Just log in and keep moving forward, no matter where life takes you.
            </p>
            {getDialog('Start Learning')}
          </div>
        </div>
      </div>
    </>
  )
}
