'use client'

import { Session } from 'next-auth'
import Link from 'next/link'
import { Separator } from '../ui/separator'
import Chart from '../chart'
import CardSection from './cards-section'

import { Set } from '@prisma/client'
import { newSetAppPath } from '@/utils/paths'
import GuestMode from './guest-mode'

type MainProps = {
  session: Session | null
  sets: Set[] | []
  chartData: { month: string; sets: number; flashcards: number; memorization: number; spelling: number }[]
}
export default function Main({ session, sets, chartData }: MainProps) {
  const chartConfig = {
    sets: { label: 'Created Sets', color: 'hsl(var(--chart-1))' },
    flashcards: { label: 'Passed Flashcards', color: 'hsl(var(--chart-2))' },
    memorization: { label: 'Passed Memorization', color: 'hsl(var(--chart-3))' },
    spelling: { label: 'Passed Spelling', color: 'hsl(var(--chart-4))' },
  }

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
        <GuestMode />
      )}
    </div>
  )
}
