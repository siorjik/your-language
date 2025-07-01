'use client'

import { useState } from 'react'
import { Session } from 'next-auth'
import Link from 'next/link'

import DialogWrap from '../dialog-wrap'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import SignInForm from '../forms/sign-in-form'
import SignUpForm from '../forms/sign-up-form'
import { Separator } from '../ui/separator'
import Chart from '../chart'
import CardSection from './cards-section'

import { Set } from '@prisma/client'
import { newSetAppPath } from '@/utils/paths'

type MainProps = {
  session: Session | null
  sets: Set[] | []
  chartData: { month: string; sets: number; flashcards: number; memorization: number; spelling: number }[]
}
export default function Main({ session, sets, chartData }: MainProps) {
  const [isClose, setClose] = useState(false)

  const chartConfig = {
    sets: { label: 'Created Sets', color: 'hsl(var(--chart-1))' },
    flashcards: { label: 'Passed Flashcards', color: 'hsl(var(--chart-2))' },
    memorization: { label: 'Passed Memorization', color: 'hsl(var(--chart-3))' },
    spelling: { label: 'Passed Spelling', color: 'hsl(var(--chart-4))' },
  }

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

  return (
    <div>
      {session?.user ? (
        <div>
          {!!sets.length ? (
            <>
              <h3 className="sub-title-1 text-center">Your activity:</h3>
              <Chart data={chartData} config={chartConfig} />
              <Separator className="my-5 h-[2px]" />
              <CardSection sets={sets} />
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
