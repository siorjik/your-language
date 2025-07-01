'use server'

import errHandlerService from '@/services/errHandlerService'
import getServerSessionToken from '@/helpers/getServerSessionToken'
import { prisma } from '@/lib/prisma'
import { ActivityType } from '@prisma/client'
import { Err } from '@/types/errTypes'

export const getActivityTypes = async (): Promise<{ activityTypes: ActivityType[]; error: null } | Err> => {
  try {
    await getServerSessionToken()

    return { activityTypes: await prisma.activityType.findMany(), error: null }
  } catch (error) {
    return errHandlerService(error)
  }
}
