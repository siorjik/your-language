'use client'

import { createContext, ReactNode, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { ActivityType } from '@prisma/client'
import apiRequestService from '@/services/apiRequestService'
import { activityTypesListApiPath } from '@/utils/paths'

export const ActivityTypesContext = createContext<{ activityTypes: ActivityType[] | null } | null>(null)

export const ActivityTypesProvider = ({ children }: { children: ReactNode }) => {
  const [activityTypes, setActivityTypes] = useState<ActivityType[] | null>(null)

  const { data } = useQuery<{ activityTypes: ActivityType[]; error: null }>({
    queryKey: ['activity-types'],
    queryFn: async () => await apiRequestService({ url: activityTypesListApiPath }),
  })

  useEffect(() => {
    if (data) setActivityTypes(data.activityTypes)
  }, [data])

  return <ActivityTypesContext value={{ activityTypes }}>{children}</ActivityTypesContext>
}
