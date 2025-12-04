'use client'

import { Session } from 'next-auth'
import { useTranslations } from 'next-intl'

import Link from '../link'
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
  const t = useTranslations('Home.session')

  const chartConfig = {
    sets: { label: `${t('chart.sets')}`, color: 'hsl(var(--chart-1))' },
    flashcards: { label: `${t('chart.flashcards')}`, color: 'hsl(var(--chart-2))' },
    memorization: { label: `${t('chart.memorization')}`, color: 'hsl(var(--chart-3))' },
    spelling: { label: `${t('chart.spelling')}`, color: 'hsl(var(--chart-4))' },
    associations: { label: `${t('chart.associations')}`, color: 'hsl(var(--chart-5))' },
  }

  return (
    <>
      {session?.user ? (
        <>
          {!!sets.length ? (
            <>
              <h2 className="title text-center">{t('activity')}</h2>
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
