'use server'

import { revalidatePath } from 'next/cache'
import { getLocale } from 'next-intl/server'

import errHandlerService from '@/services/errHandlerService'
import getServerSessionToken from '@/helpers/getServerSessionToken'
import { prisma } from '@/lib/prisma'
import { Activity } from '@prisma/client'
import { Err } from '@/types/errTypes'

export const createActivity = async (activityTypeId: string, setId: string): Promise<(Activity & { error: null }) | Err> => {
  try {
    const session = await getServerSessionToken()

    const locale = await getLocale()

    revalidatePath(`/${locale}`)

    return { ...(await prisma.activity.create({ data: { setId, activityTypeId, userId: session.id } })), error: null }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const getActivityList = async (): Promise<({ activities: Activity[] } & { error: null }) | Err> => {
  try {
    const session = await getServerSessionToken()

    return { activities: await prisma.activity.findMany({ where: { userId: session.id } }), error: null }
  } catch (error) {
    return errHandlerService(error)
  }
}
