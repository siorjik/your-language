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

import { Set } from '@prisma/client'
import { newSetAppPath } from '@/utils/paths'
import getMonthName from '@/helpers/getMonthName'
import CardSection from './cards-section'

export default function Main({ session, sets }: { session: Session | null; sets: Set[] | [] }) {
  const [isClose, setClose] = useState(false)

  const getChartMappedData = () => {
    return sets.reduce(
      (acc = [], current, _, arr) => {
        if (!acc.find((item) => item.month === getMonthName(new Date(current.createdAt).getMonth()))) {
          acc.push({
            month: getMonthName(new Date(current.createdAt).getMonth()),
            created: arr.filter(
              (el) => getMonthName(new Date(el.createdAt).getMonth()) === getMonthName(new Date(current.createdAt).getMonth()),
            ).length,
            updated: arr.filter(
              (el) => getMonthName(new Date(el.updatedAt).getMonth()) === getMonthName(new Date(current.updatedAt).getMonth()),
            ).length,
          })
        }

        return acc
      },
      [] as { month: string; created: number; updated: number }[],
    )
  }

  const chartConfig = {
    created: { label: 'Created Sets', color: 'hsl(var(--chart-1))' },
    updated: { label: 'Updated Sets', color: 'hsl(var(--chart-2))' },
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
              <Chart data={getChartMappedData()} config={chartConfig} />
              <Separator className="my-5" />
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
