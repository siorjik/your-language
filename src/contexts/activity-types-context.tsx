'use client'

import { createContext, useEffect, useState } from 'react'

import { ActivityType } from '@prisma/client'
import apiRequestService from '@/services/apiRequestService'
import { activityTypesListApiPath } from '@/utils/paths'

export const ActivityTypesContext = createContext<{ activityTypes: ActivityType[] | null } | null>(null)

export const ActivityTypesProvider = ({ children }: { children: React.ReactNode }) => {
  const [activityTypes, setActivityTypes] = useState<ActivityType[] | null>(null)

  useEffect(() => {
    console.log('activityTypesListApiPath - ', activityTypesListApiPath)
      ; (async () => {
        try {
          const res: { activityTypes: ActivityType[]; error: null } = await apiRequestService({
            url: activityTypesListApiPath,
            // url: 'https://language-bro.online/api/activity-types',
          })

          setActivityTypes(res.activityTypes)
        } catch (error) {
          console.log(error)
        }
      })()
  }, [])

  return <ActivityTypesContext value={{ activityTypes }}>{children}</ActivityTypesContext>
}
