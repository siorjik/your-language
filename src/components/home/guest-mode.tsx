'use client'

import { useState } from 'react'
import Image from 'next/image'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import DialogWrap from '../dialog-wrap'
import SignInForm from '../forms/sign-in-form'
import SignUpForm from '../forms/sign-up-form'
import { TextLoop } from '../ui/text-loop'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { GlowEffect } from '../ui/glow-effect'

import flashcardsImg from '@/../public/flashcards.jpg'

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
      title="Welcome!"
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
      <div className="h-fit xl:h-[300px] flex flex-col xl:flex-row gap-10 justify-center items-center">
        <div className="w-full xl:w-1/2 text-muted-foreground text-center">
          <h3 className="sub-title-1 mb-5 text-primary/50">Welcome to Your Language Companion!</h3>
          <p className="max-w-[500px] mx-auto p-3 bg-muted rounded-lg italic font-semibold">
            Discover a smarter, more engaging way to learn English. Whether you`re just starting out or sharpening advanced
            skills, our powerful tools help you build vocabulary, master grammar, and grow your confidence - step by step
            <span className="emoji">👌</span>
          </p>
        </div>
        <div className="w-full xl:w-1/2 text-center">
          <TextLoop className="w-full mb-10 text-center hidden md:block" interval={5} transition={{ duration: 0.5 }}>
            <span className="sub-title-1 text-3xl">Improve your language skills!</span>
            <span className="sub-title-1 text-3xl">Increase your conversation confidence!</span>
            <span className="sub-title-1 text-3xl ">Expend your vocabulary!</span>
            <span className="sub-title-1 text-3xl">Enjoy your learning process!</span>
          </TextLoop>
          <div className="w-fit mx-auto py-2 px-4 relative">
            <GlowEffect className="rounded-lg" mode="colorShift" blur="soft" duration={5} scale={1} />
            <DialogWrap
              width="max-w-[400px]"
              title="Welcome!"
              trigger={
                <Button className="relative hover:bg-initial p-8 text-xl" variant="ghost">
                  Start Your Journey
                </Button>
              }
              content={dialogContent}
              isAutoClose={isClose}
            />
          </div>
        </div>
      </div>
      <Separator className="my-8 h-[2px]" />
      <div className="flex flex-col md:flex-row gap-5 items-center">
        <div className="w-full md:w-1/2">
          <Image src={flashcardsImg} alt="flash-cards" width={300} height={300} className="h-[300px] mx-auto" />
        </div>
        <div className="w-full md:w-1/2 text-center text-muted-foreground">
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
      <Separator className="my-8 h-[2px]" />
      <div className="flex flex-col-reverse md:flex-row gap-5 items-center">
        <div className="w-full md:w-1/2 text-center text-muted-foreground">
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
        <div className="w-full md:w-1/2">
          <Image src={flashcardsImg} alt="flash-cards" width={300} height={300} className="h-[300px] mx-auto" />
        </div>
      </div>
      <Separator className="my-8 h-[2px]" />
      <div className="flex flex-col md:flex-row gap-5 items-center">
        <div className="w-full md:w-1/2">
          <Image src={flashcardsImg} alt="flash-cards" width={300} height={300} className="h-[300px] mx-auto" />
        </div>
        <div className="w-full md:w-1/2 text-center text-muted-foreground">
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
    </>
  )
}
