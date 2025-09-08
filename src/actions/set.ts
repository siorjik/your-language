'use server'

import { revalidatePath } from 'next/cache'
import z from 'zod'

import errHandlerService from '@/services/errHandlerService'
import { setFormTypeSchema } from '@/types/forms/set'
import getServerSessionToken from '@/helpers/getServerSessionToken'
import { prisma } from '@/lib/prisma'
import { setsAppPath } from '@/utils/paths'
import { Err } from '@/types/errTypes'
import { SelectedSet, SetList } from '@/types/models/set'

export const createSet = async (data: z.infer<typeof setFormTypeSchema>): Promise<(SelectedSet & { error: null }) | Err> => {
  try {
    setFormTypeSchema.parse(data)

    const session = await getServerSessionToken()

    const { title, source, target, list } = data

    revalidatePath(setsAppPath)

    return {
      ...((await prisma.set.create({ data: { title, source, target, list, userId: session.id } })) as SelectedSet),
      error: null,
    }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const updateSet = async (data: z.infer<typeof setFormTypeSchema>): Promise<(SelectedSet & { error: null }) | Err> => {
  try {
    setFormTypeSchema.parse(data)

    await getServerSessionToken()

    const { title, source, target, list, id } = data

    revalidatePath(setsAppPath)

    return {
      ...((await prisma.set.update({ where: { id }, data: { title, source, target, list } })) as SelectedSet),
      error: null,
    }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const getSetList = async (
  filter: { title?: string; from?: string; to?: string } | null = null,
  id: string | null = null,
): Promise<{ sets: SelectedSet[]; error: null } | Err> => {
  try {
    const session = await getServerSessionToken()

    const filterParams: { [key: string]: Record<string, string | Date> } | null =
      filter &&
      Object.keys(filter).reduce(
        (acc, cur) => {
          switch (cur) {
            case 'title':
              acc.title = { contains: filter.title!, mode: 'insensitive' }
              break
            case 'from':
              acc.createdAt = { gte: new Date(filter.from!), lte: new Date(filter.to!) }

            default:
              break
          }

          return acc
        },
        { title: {}, createdAt: {} } as { title: Record<string, string>; createdAt: Record<string, Date> },
      )

    if (filterParams) Object.keys(filterParams).forEach((k) => !Object.keys(filterParams[k]).length && delete filterParams[k])

    return {
      sets: (await prisma.set.findMany({
        where: { userId: id || session.id, ...filterParams },
        include: {
          user: { select: { name: true, image: true, id: true } },
          owner: { select: { name: true, image: true, id: true } },
        },
      })) as SelectedSet[],
      error: null,
    }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const getSetById = async (id: string, ownerId?: string): Promise<(SelectedSet & { error: null }) | Err> => {
  let set: SelectedSet | null

  try {
    const session = await getServerSessionToken()

    if (ownerId && ownerId !== session.id) {
      const sharedSet = await prisma.set.findFirst({ where: { id }, omit: { id: true } })

      if (sharedSet) {
        set = (await prisma.set.create({
          data: { ...sharedSet, list: sharedSet.list as SetList, userId: session.id, ownerId },
        })) as SelectedSet
      } else throw Error('Set sharing error')
    } else
      set = (await prisma.set.findFirst({
        where: { id },
        include: {
          user: { select: { name: true, image: true, id: true } },
          owner: { select: { name: true, image: true, id: true } },
        },
      })) as SelectedSet

    if (set) return { ...(set as SelectedSet), error: null }
    else throw Error('Set not found')
  } catch (error) {
    return errHandlerService(error)
  }
}

export const deleteSet = async (id: string, isRevalidate: boolean = true): Promise<{ success: true; error: null } | Err> => {
  try {
    await getServerSessionToken()

    await prisma.set.delete({ where: { id } })

    if (isRevalidate) revalidatePath(setsAppPath)

    return { success: true, error: null }
  } catch (error) {
    return errHandlerService(error)
  }
}
