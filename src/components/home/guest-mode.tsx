'use client'

import { useState } from 'react'
import Image from 'next/image'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import DialogWrap from '../dialog-wrap'
import SignInForm from '../forms/sign-in-form'
import SignUpForm from '../forms/sign-up-form'
import { Button } from '../ui/button'
import HeroSection from './hero-section'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card'

import flashcardsImg from '@/../public/flashcards.png'
import deviceImg from '@/../public/devices.png'
import chartImg from '@/../public/chart.png'

export default function GuestMode() {
  const [isClose, setClose] = useState(false)

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
      <div className="min-h-[calc(100vh-50px)] pt-10 pb-5 flex justify-center items-center">
        <div className="flex flex-wrap gap-10 justify-center items-center">
          <Card className="lg:min-h-[800px] flex flex-col justify-between bg-primary/10 border-0 shadow-xl text-center">
            <div>
              <CardHeader>
                <CardTitle className="font-poppins text-primary/50">Flashcards & Quizzes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="max-w-[350px] mx-auto mb-8 p-3 bg-muted rounded-lg italic font-semibold text-muted-foreground">
                  Master new words and phrases faster than ever with our{' '}
                  <span className="text-primary">Flashcards & Quizzes</span>. Effortlessly review vocabulary in bite-sized
                  sessions, then challenge yourself with quick quizzes that keep your memory sharp. Flashcards help you visualize,
                  repeat, and retain essential language, while quizzes turn learning into an engaging game. Whether you have just
                  a few minutes or a whole hour, these tools adapt to your pace and keep you motivated. Explore, practice, and
                  grow your English skills - all in one place.
                </p>
                <Image src={flashcardsImg} alt="flash-cards" width={300} height={300} className="mx-auto mb-5" priority />
              </CardContent>
            </div>
            <CardFooter>
              <span className="mx-auto">{getDialog('Create Flashcards')}</span>
            </CardFooter>
          </Card>

          <Card className="lg:min-h-[800px] flex flex-col justify-between bg-primary/10 border-0 shadow-xl text-center">
            <div>
              <CardHeader>
                <CardTitle className="font-poppins text-primary/50">Your Personal Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="max-w-[350px] mx-auto mb-8 p-3 bg-muted rounded-lg italic font-semibold text-muted-foreground">
                  Stay on top of your progress with <span className="text-primary">Your Personal Activity Tracker</span>. See how
                  much you`ve learned, track your daily practice, and celebrate every milestone. From completed flashcards to quiz
                  scores and study streaks, your tracker keeps everything organized in one place. It`s the easiest way to stay
                  motivated, set goals, and watch your English skills grow step by step. Learning is a journey - let your activity
                  tracker guide the way!
                </p>
                <Image src={chartImg} alt="flash-cards" width={300} height={300} className="mx-auto mb-5" priority />
              </CardContent>
            </div>
            <CardFooter>
              <span className="mx-auto">{getDialog('Start Activity')}</span>
            </CardFooter>
          </Card>

          <Card className="lg:min-h-[800px] flex flex-col justify-between bg-primary/10 border-0 shadow-xl text-center">
            <div>
              <CardHeader>
                <CardTitle className="font-poppins text-primary/50">Accessible Anywhere</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="max-w-[350px] mx-auto mb-3 p-3 bg-muted rounded-lg italic font-semibold text-muted-foreground">
                  With <span className="text-primary font-semibold">Accessible Anywhere</span>, your language learning goes
                  wherever you go. Whether you`re on your phone, tablet, or computer, all your flashcards, quizzes, and progress
                  are always synced and ready. Practice on the bus, at the café, or from the comfort of home - your learning is
                  never limited by location. Just log in and keep moving forward, no matter where life takes you.
                </p>
                <Image src={deviceImg} alt="flash-cards" width={300} height={300} className="mx-auto" priority />
              </CardContent>
            </div>
            <CardFooter>
              <span className="mx-auto">{getDialog('Start Learning')}</span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}
