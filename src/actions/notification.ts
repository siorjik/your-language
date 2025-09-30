'use server'

import z from 'zod'

import { NotificationTypeSchema } from '@/types/models/notification'
import { Notification } from '@prisma/client'
import errHandlerService from '@/services/errHandlerService'
import { Err } from '@/types/errTypes'
import getServerSessionToken from '@/helpers/getServerSessionToken'
import { prisma } from '@/lib/prisma'
import { NOTIFICATION_STATUSES } from '@/utils/constants'

export const createNotification = async (
  data: z.infer<typeof NotificationTypeSchema>,
): Promise<(Notification & { error: null }) | Err> => {
  try {
    NotificationTypeSchema.parse(data)

    const session = await getServerSessionToken()

    // delete spare notifications, only 4 need to be
    const count = await prisma.notification.count({ where: { recipientId: data.recipientId || session.id } })
    if (count > 3) {
      const toDelete = await prisma.notification.findMany({
        where: { recipientId: data.recipientId || session.id },
        orderBy: { createdAt: 'asc' },
        take: count - 3,
        select: { id: true },
      })

      await prisma.notification.deleteMany({ where: { id: { in: toDelete.map((el) => el.id) } } })
    }

    return {
      ...(await prisma.notification.create({
        data: {
          ...data,
          userId: session.id,
          recipientId: data.recipientId || session.id,
          status: data.status || NOTIFICATION_STATUSES.new,
        },
      })),
      error: null,
    }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const getUserNotifications = async (): Promise<{ notifications: Notification[]; error: null } | Err> => {
  try {
    const session = await getServerSessionToken()

    return {
      notifications: await prisma.notification.findMany({ where: { recipientId: session.id }, orderBy: { createdAt: 'desc' } }),
      error: null,
    }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const readNotification = async (id: string): Promise<{ success: true; error: null } | Err> => {
  try {
    await getServerSessionToken()

    await prisma.notification.update({ where: { id }, data: { status: 'read' } })

    return { success: true, error: null }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const deleteNotification = async (id: string): Promise<{ success: true; error: null } | Err> => {
  try {
    await getServerSessionToken()

    await prisma.notification.delete({ where: { id } })

    return { success: true, error: null }
  } catch (error) {
    return errHandlerService(error)
  }
}
