import Home from '@/components/home'
import Layout from '@/components/layout'

import { getSetList } from '@/actions/set'
import { getActivityList } from '@/actions/activity'
import { auth } from '@/configs/auth'
import { Err } from '@/types/errTypes'
import { Activity, ActivityType, Set } from '@prisma/client'
import getMonthName from '@/helpers/getMonthName'
import { getActivityTypes } from '@/actions/activityType'

export default async function HomePage() {
  let resSets: { sets: Set[]; error: null } | Err | null = null
  let mappedChartData: { month: string; sets: number; flashcards: number; memorization: number; spelling: number }[] = []

  const session = await auth()

  if (!session) resSets = null
  else {
    resSets = await getSetList()
    const resActivities: { activities: Activity[]; error: null } | Err = await getActivityList()
    const resActivityTypes: { activityTypes: ActivityType[]; error: null } | Err = await getActivityTypes()

    if (!resSets.error && !resActivities.error && !resActivityTypes.error) {
      const activityTypes = resActivityTypes.activityTypes

      const setsMappedData = resSets.sets.reduce(
        (acc = [], current, _, arr) => {
          if (!acc.find((item) => item.month === getMonthName(new Date(current.createdAt).getMonth()))) {
            acc.push({
              month: getMonthName(new Date(current.createdAt).getMonth()),
              sets: arr.filter(
                (el) => getMonthName(new Date(el.createdAt).getMonth()) === getMonthName(new Date(current.createdAt).getMonth()),
              ).length,
            })
          }

          return acc
        },
        [] as { month: string; sets: number }[],
      )

      const activityMappedData = resActivities.activities.reduce(
        (acc = [], current, _, arr) => {
          if (!acc.find((item) => item.month === getMonthName(new Date(current.createdAt).getMonth()))) {
            acc.push({
              month: getMonthName(new Date(current.createdAt).getMonth()),
              flashcards: arr.filter(
                (el) =>
                  getMonthName(new Date(el.createdAt).getMonth()) === getMonthName(new Date(current.createdAt).getMonth()) &&
                  activityTypes.find((item) => item.name === 'flashcards' && item.id === el.activityTypeId),
              ).length,
              memorization: arr.filter(
                (el) =>
                  getMonthName(new Date(el.createdAt).getMonth()) === getMonthName(new Date(current.createdAt).getMonth()) &&
                  activityTypes.find((item) => item.name === 'memorization' && item.id === el.activityTypeId),
              ).length,
              spelling: arr.filter(
                (el) =>
                  getMonthName(new Date(el.createdAt).getMonth()) === getMonthName(new Date(current.createdAt).getMonth()) &&
                  activityTypes.find((item) => item.name === 'spelling' && item.id === el.activityTypeId),
              ).length,
            })
          }

          return acc
        },
        [] as { month: string; flashcards: number; memorization: number; spelling: number }[],
      )

      mappedChartData = [...setsMappedData, ...activityMappedData].reduce(
        (acc, current) => {
          if (!acc.find((el) => el.month === current.month)) {
            if (
              setsMappedData.find((el) => el.month === current.month) &&
              activityMappedData.find((el) => el.month === current.month)
            ) {
              acc.push({
                ...setsMappedData.find((el) => el.month === current.month)!,
                ...activityMappedData.find((el) => el.month === current.month)!,
              })
            } else if (!setsMappedData.find((el) => el.month === current.month)) {
              acc.push({ ...activityMappedData.find((el) => el.month === current.month)!, sets: 0 })
            } else {
              acc.push({
                ...setsMappedData.find((el) => el.month === current.month)!,
                flashcards: 0,
                memorization: 0,
                spelling: 0,
              })
            }
          }

          return acc
        },
        [] as { month: string; sets: number; flashcards: number; memorization: number; spelling: number }[],
      )
    }
  }

  return (
    <Layout>
      <Home session={session} sets={(resSets?.error ? [] : resSets?.sets) || []} chartData={mappedChartData!} />
    </Layout>
  )
}
