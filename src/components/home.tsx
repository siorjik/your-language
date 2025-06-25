'use client'

import { RefObject, useLayoutEffect, useRef, useState } from 'react'
import { Session } from 'next-auth'
import Link from 'next/link'
import { ChevronRight, ChevronLeft } from 'lucide-react'

import DialogWrap from './dialog-wrap'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import SignInForm from './forms/sign-in-form'
import SignUpForm from './forms/sign-up-form'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from './ui/card'
import { Separator } from './ui/separator'

import { Set } from '@prisma/client'
import { getSetAppPath, newSetAppPath } from '@/utils/paths'
import { LANGUAGE_OPTIONS } from '@/utils/constants'

export default function Main({ session, sets }: { session: Session | null; sets: Set[] | [] }) {
  const [isClose, setClose] = useState(false)
  const [isShowNav, setShowNav] = useState(false)

  const createdRef = useRef<HTMLDivElement>(null)
  const updatedRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    // to trigger scroll arrows
    window.addEventListener('resize', toggleShowArr)

    return () => {
      window.removeEventListener('resize', toggleShowArr)
    }
  }, [isShowNav])

  const toggleShowArr = () => setShowNav(!isShowNav)

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

  const getSetCard = (set: Set, date: string) => {
    return (
      <Card key={set.id} className="min-w-[300px] text-center border-0 bg-secondary/40 shadow-lg">
        <CardHeader>
          <CardTitle className="truncate">{set.title}</CardTitle>
          <CardDescription>
            {LANGUAGE_OPTIONS.find((lg) => lg.value === set.source)?.label}
            {' / '}
            {LANGUAGE_OPTIONS.find((lg) => lg.value === set.target)?.label}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{date}</p>
        </CardContent>
        <CardFooter>
          <Link href={getSetAppPath(set.id)} className="mx-auto link">
            Go To Set {'>>>'}
          </Link>
        </CardFooter>
      </Card>
    )
  }

  const moveSlides = (direction: 'back' | 'ahead', ref: HTMLDivElement) => {
    if (direction === 'ahead') ref.scrollLeft += ref.clientWidth
    else ref.scrollLeft -= ref.clientWidth
  }

  const getCardsSection = (type: 'created' | 'updated', ref: RefObject<HTMLDivElement>) => {
    const isCreated = type === 'created'
    let isShow = false

    const arr = sets
      .sort((a, b) => +new Date(isCreated ? b.createdAt : b.updatedAt) - +new Date(isCreated ? a.createdAt : a.updatedAt))
      .slice(-4)

    switch (arr.length) {
      case 2:
        if (window.innerWidth < 768) isShow = true
        break
      case 3:
        if (window.innerWidth <= 768) isShow = true
        break
      case 4:
        if (window.innerWidth < 1440) isShow = true
        break

      default:
        isShow = false
    }

    return (
      <>
        <p className=" text-muted-foreground leading-3">{isCreated ? 'Created' : 'Updated'} sets</p>
        <div className="relative overflow-hidden">
          <div className="w-full py-5 flex gap-5 overflow-x-auto scroll-smooth" ref={ref}>
            <span
              className={`icon-hover absolute z-10 left-2 top-24 ${!isShow ? 'hidden' : ''}`}
              onClick={() => moveSlides('back', ref.current)}
            >
              <ChevronLeft size={30} />
            </span>
            {arr.map((set) => {
              const date = new Date(isCreated ? set.createdAt : set.updatedAt).toDateString()

              return getSetCard(set, date)
            })}
            <span
              className={`icon-hover absolute z-10 right-2 top-24 ${!isShow ? 'hidden' : ''}`}
              onClick={() => moveSlides('ahead', ref.current)}
            >
              <ChevronRight size={30} />
            </span>
          </div>
        </div>
      </>
    )
  }

  return (
    <div>
      {session?.user ? (
        <div>
          <h3 className="sub-title text-center">Your recent activity:</h3>
          {!!sets.length ? (
            <>
              {getCardsSection('created', createdRef as RefObject<HTMLDivElement>)}
              <Separator className="mb-5" />
              {getCardsSection('updated', updatedRef as RefObject<HTMLDivElement>)}
            </>
          ) : (
            <>
              <span>No created sets,</span>{' '}
              <Link href={newSetAppPath} className="link">
                create a new one!
              </Link>
            </>
          )}
        </div>
      ) : (
        <DialogWrap
          width="max-w-[400px]"
          title="Welcome!"
          trigger={
            <div>
              <span>Improve your English! Just </span>
              <span className="link">join</span>
            </div>
          }
          content={dialogContent}
          isAutoClose={isClose}
        />
      )}
    </div>
  )
}
