import Home from '@/components/home'
import Layout from '@/components/layout'

import { getSetList } from '@/actions/set'
import { getActivityList } from '@/actions/activity'
import { auth } from '@/configs/auth'
import { Err } from '@/types/errTypes'
import { Activity, ActivityType } from '@prisma/client'
import { getActivityTypes } from '@/actions/activityType'
import { MONTHS } from '@/utils/constants'
import { SelectedSet } from '@/types/models/set'

export default async function HomePage({ searchParams }: { searchParams: Promise<{ year: string }> }) {
  const { year } = await searchParams

  let years: string[] = []
  let resSets: { sets: SelectedSet[]; error: null } | Err | null = null
  let mappedChartData: {
    month: string
    sets: number
    flashcards: number
    memorization: number
    spelling: number
    associations: number
  }[] = []

  const session = await auth()

  if (!session) resSets = null
  else {
    resSets = await getSetList()
    const resActivities: { activities: Activity[]; error: null } | Err = await getActivityList()
    const resActivityTypes: { activityTypes: ActivityType[]; error: null } | Err = await getActivityTypes()

    if (!resSets.error && !resActivities.error && !resActivityTypes.error) {
      years = [
        ...new Set([
          ...new Set(resSets.sets.map((set) => set.createdAt.getFullYear())),
          ...new Set(resActivities.activities.map((activity) => activity.createdAt.getFullYear())),
        ]),
      ]
        .sort((a, b) => b - a)
        .map((year) => year.toString())

      const selectedYear = year ?? years[0]
      const activityTypes = resActivityTypes.activityTypes
      const setList = resSets.sets.filter((set) => +set.createdAt.getFullYear() === +selectedYear)

      const setsMappedData = setList.reduce(
        (acc = [], current, _, arr) => {
          if (!acc.find((item) => item.month === MONTHS[new Date(current.createdAt).getMonth()])) {
            acc.push({
              month: MONTHS[new Date(current.createdAt).getMonth()],
              sets: arr.filter(
                (el) => MONTHS[new Date(el.createdAt).getMonth()] === MONTHS[new Date(current.createdAt).getMonth()],
              ).length,
            })
          }

          return acc
        },
        [] as { month: string; sets: number }[],
      )

      const activityMappedData = resActivities.activities
        .filter((activity) => +activity.createdAt.getFullYear() === +selectedYear)
        .reduce(
          (acc = [], current, _, arr) => {
            if (!acc.find((item) => item.month === MONTHS[new Date(current.createdAt).getMonth()])) {
              acc.push({
                month: MONTHS[new Date(current.createdAt).getMonth()],
                flashcards: arr.filter(
                  (el) =>
                    MONTHS[new Date(el.createdAt).getMonth()] === MONTHS[new Date(current.createdAt).getMonth()] &&
                    activityTypes.find((item) => item.name === 'flashcards' && item.id === el.activityTypeId),
                ).length,
                memorization: arr.filter(
                  (el) =>
                    MONTHS[new Date(el.createdAt).getMonth()] === MONTHS[new Date(current.createdAt).getMonth()] &&
                    activityTypes.find((item) => item.name === 'memorization' && item.id === el.activityTypeId),
                ).length,
                spelling: arr.filter(
                  (el) =>
                    MONTHS[new Date(el.createdAt).getMonth()] === MONTHS[new Date(current.createdAt).getMonth()] &&
                    activityTypes.find((item) => item.name === 'spelling' && item.id === el.activityTypeId),
                ).length,
                associations: arr.filter(
                  (el) =>
                    MONTHS[new Date(el.createdAt).getMonth()] === MONTHS[new Date(current.createdAt).getMonth()] &&
                    activityTypes.find((item) => item.name === 'associations' && item.id === el.activityTypeId),
                ).length,
              })
            }

            return acc
          },
          [] as { month: string; flashcards: number; memorization: number; spelling: number; associations: number }[],
        )

      mappedChartData = MONTHS.reduce(
        (acc, current) => {
          if (!acc.find((el) => el.month === current)) {
            if (setsMappedData.find((el) => el.month === current) && activityMappedData.find((el) => el.month === current)) {
              acc.push({
                ...setsMappedData.find((el) => el.month === current)!,
                ...activityMappedData.find((el) => el.month === current)!,
              })
            } else if (!setsMappedData.find((el) => el.month === current)) {
              acc.push({ ...activityMappedData.find((el) => el.month === current)!, sets: 0 })
            } else {
              acc.push({
                ...setsMappedData.find((el) => el.month === current)!,
                flashcards: 0,
                memorization: 0,
                spelling: 0,
                associations: 0,
              })
            }
          }

          return acc
        },
        [] as { month: string; sets: number; flashcards: number; memorization: number; spelling: number; associations: number }[],
      ).filter((el) => !!el.month)
    }
  }

  return (
    <Layout>
      <Home session={session} sets={(resSets?.error ? [] : resSets?.sets) || []} chartData={mappedChartData!} years={years} />
    </Layout>
  )
}
