'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

import getServerSessionToken from '@/helpers/getServerSessionToken'
import errHandlerService from '@/services/errHandlerService'
import { classFormTypeSchema } from '@/types/forms/class'
import { prisma } from '@/lib/prisma'
import { Class } from '@prisma/client'
import { Err } from '@/types/errTypes'
import { classesAppPath } from '@/utils/paths'
import { SelectedClass } from '@/types/models/class'
import { SelectedSet } from '@/types/models/set'
import { SelectedUser } from '@/types/models/user'

export const createClass = async (data: z.infer<typeof classFormTypeSchema>): Promise<(Class & { error: null }) | Err> => {
  try {
    const session = await getServerSessionToken()

    classFormTypeSchema.parse(data)

    const created = await prisma.class.create({ data: { ...data, creatorId: session.id } })

    revalidatePath(classesAppPath)

    return { ...created, error: null }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const updateClass = async (
  data: z.infer<typeof classFormTypeSchema>,
): Promise<(SelectedClass & { error: null }) | Err> => {
  try {
    await getServerSessionToken()

    classFormTypeSchema.parse(data)

    const updatedClass = (await prisma.class.update({
      where: { id: data.id },
      data,
      include: { creator: { select: { id: true, name: true, image: true } } },
    })) as SelectedClass

    revalidatePath(classesAppPath)

    return { ...updatedClass, error: null }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const getClassList = async (params: {
  title?: string
  userId?: string
}): Promise<{ classes: SelectedClass[]; error: null } | Err> => {
  try {
    const session = await getServerSessionToken()

    return {
      classes: (await prisma.class.findMany({
        where: {
          OR: [{ creatorId: params?.userId || session.id }, { users: { array_contains: params?.userId || session.id } }],
          title: { contains: params.title, mode: 'insensitive' },
        },
        include: { creator: { select: { id: true, name: true, image: true } } },
      })) as SelectedClass[],
      error: null,
    }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const getClassById = async (id: string, creatorId?: string): Promise<(SelectedClass & { error: null }) | Err> => {
  let classItem

  try {
    const session = await getServerSessionToken()

    if (creatorId && creatorId !== session.id) {
      const sharedClass = await prisma.class.findFirst({ where: { id, creatorId } })

      if (sharedClass) {
        if (!(sharedClass.users as string[]).includes(session.id)) {
          classItem = (await prisma.class.update({
            where: { id },
            data: { users: [...(sharedClass.users as string[]), session.id] },
            include: { creator: { select: { id: true, name: true, image: true } } },
          })) as SelectedClass
        } else {
          classItem = (await prisma.class.findFirst({
            where: { id },
            include: { creator: { select: { id: true, name: true, image: true } } },
          })) as SelectedClass
        }
      } else throw Error('Class sharing error')
    } else {
      classItem = (await prisma.class.findFirst({
        where: { id },
        include: { creator: { select: { id: true, name: true, image: true } } },
      })) as SelectedClass
    }

    return { ...classItem, error: null }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const deleteClassById = async (id: string): Promise<{ success: true; error: null } | Err> => {
  try {
    await getServerSessionToken()

    await prisma.class.delete({ where: { id } })

    return { success: true, error: null }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const getClassSets = async (id: string): Promise<{ sets: SelectedSet[]; error: null } | Err> => {
  try {
    await getServerSessionToken()

    const classSets = (await prisma.class.findFirst({ where: { id }, select: { sets: true } })) as { sets: string[] }

    const sets = (await prisma.set.findMany({ where: { id: { in: [...classSets.sets] } } })) as SelectedSet[]

    return { sets, error: null }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const getClassUsers = async (id: string): Promise<{ users: SelectedUser[]; error: null } | Err> => {
  try {
    await getServerSessionToken()

    const classUsers = (await prisma.class.findFirst({ where: { id }, select: { users: true } })) as { users: string[] }

    const users = (await prisma.user.findMany({
      where: { id: { in: [...classUsers.users] } },
      omit: { password: true },
    })) as SelectedUser[]

    return { users, error: null }
  } catch (error) {
    return errHandlerService(error)
  }
}
