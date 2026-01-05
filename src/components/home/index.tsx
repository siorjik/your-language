'use client'

import { Session } from 'next-auth'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'

import Link from '../link'
import { Separator } from '../ui/separator'
import Chart from '../chart'
import CardSection from './cards-section'
import SelectWrap from '../select-wrap'
import GuestMode from './guest-mode'

import { libraryAppPath } from '@/utils/paths'
import { SelectedSet } from '@/types/models/set'
import useLocaleUrl from '@/hooks/use-locale-url'

type MainProps = {
  years: number[]
  session: Session | null
  sets: SelectedSet[] | []
  chartData: { month: string; sets: number; flashcards: number; memorization: number; spelling: number }[]
}
export default function Home({ session, sets, chartData, years }: MainProps) {
  const t = useTranslations('Home.session')
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const { getLocaleUrl } = useLocaleUrl()

  const year = searchParams.get('year')

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
          {!!chartData.length ? (
            <>
              <div className="mb-10 flex flex-col md:flex-row justify-around items-center">
                <h2 className={`title text-center ${years.length > 1 ? 'mb-5' : 'mb-0'} md:mb-0`}>{t('activity')}</h2>
                {years.length > 1 && (
                  <div className="flex gap-5 justify-center items-center md:items-start mb-0">
                    <div className="sub-title-3 mb-0 md:mt-2">{t('year')}:</div>
                    <SelectWrap
                      options={years.map((year) => ({ value: year.toString(), label: year.toString() }))}
                      defaultValue={year || years[0].toString()}
                      onValueChange={(val) => push(getLocaleUrl(`/?year=${val}`))}
                      placeholder="Choose year"
                      label="Choose year:"
                      css="min-w-28 w-28"
                    />
                  </div>
                )}
              </div>
              <Chart data={chartData} config={chartConfig} />
              <Separator className="my-5 h-[2px]" />
              <CardSection sets={sets.filter((set) => set.creator?.name === session.user.name)} />
            </>
          ) : (
            <div className="h-[calc(100vh-160px)] flex flex-col justify-center items-center">
              <Link href={libraryAppPath} className="link text-xl">
                {t('createSet')} 🤓 {'>>>'}
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
