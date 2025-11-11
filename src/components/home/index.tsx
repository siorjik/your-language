'use client'

import { Session } from 'next-auth'
import Link from 'next/link'
import { Separator } from '../ui/separator'
import Chart from '../chart'
import CardSection from './cards-section'

import { libraryAppPath } from '@/utils/paths'
import GuestMode from './guest-mode'
import { SelectedSet } from '@/types/models/set'

type MainProps = {
  session: Session | null
  sets: SelectedSet[] | []
  chartData: { month: string; sets: number; flashcards: number; memorization: number; spelling: number }[]
}
export default function Home({ session, sets, chartData }: MainProps) {
  const chartConfig = {
    sets: { label: 'Created Sets', color: 'hsl(var(--chart-1))' },
    flashcards: { label: 'Passed Flashcards', color: 'hsl(var(--chart-2))' },
    memorization: { label: 'Passed Memorization', color: 'hsl(var(--chart-3))' },
    spelling: { label: 'Passed Spelling', color: 'hsl(var(--chart-4))' },
    associations: { label: 'Passed Associations', color: 'hsl(var(--chart-5))' },
  }

  return (
    <>
      {session?.user ? (
        <>
          {!!sets.length ? (
            <>
              <h2 className="title text-center">Your activity</h2>
              <Chart data={chartData} config={chartConfig} />
              <Separator className="my-5 h-[2px]" />
              <CardSection sets={sets.filter((set) => set.creator?.name === session.user.name)} />
            </>
          ) : (
            <div className="h-[calc(100vh-160px)] flex flex-col justify-center items-center">
              <Link href={libraryAppPath} className="link text-xl">
                Visit Library and create your first Set 🤓 {'>>>'}
              </Link>
            </div>
          )}
        </>
      ) : (
        <GuestMode />
      )}
    </>
  )
}
