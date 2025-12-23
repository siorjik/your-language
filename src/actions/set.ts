'use server'

import { revalidatePath } from 'next/cache'
import z from 'zod'
import { getTranslations } from 'next-intl/server'

import errHandlerService from '@/services/errHandlerService'
import { setFormTypeSchema } from '@/types/forms/set'
import getServerSessionToken from '@/helpers/getServerSessionToken'
import { prisma } from '@/lib/prisma'
import { setsAppPath } from '@/utils/paths'
import { Err } from '@/types/errTypes'
import { SelectedSet, SetList, SetCreator } from '@/types/models/set'
import { INFINITY_SCROLL_LIMIT } from '@/utils/constants'

export const createSet = async (data: z.infer<typeof setFormTypeSchema>): Promise<(SelectedSet & { error: null }) | Err> => {
  try {
    const session = await getServerSessionToken()

    setFormTypeSchema.parse(data)

    const { title, source, target, list } = data

    revalidatePath(setsAppPath)

    return {
      ...((await prisma.set.create({
        data: { title, source, target, list, userId: session.id, creatorId: session.id },
      })) as SelectedSet),
      error: null,
    }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const updateSet = async (data: z.infer<typeof setFormTypeSchema>): Promise<(SelectedSet & { error: null }) | Err> => {
  try {
    await getServerSessionToken()

    setFormTypeSchema.parse(data)

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

type SetListParams = {
  filter?: { title?: string; from?: string; to?: string; creators?: string }
  id?: string
  limit?: number
  cursor?: string
}

export const getSetList = async (
  params: SetListParams | undefined = undefined,
): Promise<{ sets: SelectedSet[]; count: number; error: null; nextCursor?: string | null } | Err> => {
  try {
    const session = await getServerSessionToken()

    const filterParams: { [key: string]: Record<string, string | Date | string[]> } | null | undefined =
      params?.filter &&
      Object.keys(params.filter).reduce(
        (acc, cur) => {
          switch (cur) {
            case 'title':
              acc.title = { contains: params.filter!.title!, mode: 'insensitive' }
              break
            case 'from':
              acc.createdAt = { gte: new Date(params.filter!.from!), lte: new Date(params.filter!.to!) }
              break
            case 'creators':
              acc.creatorId = { in: params.filter!.creators!.split(',') }
              break

            default:
              break
          }

          return acc
        },
        { title: {}, createdAt: {}, creatorId: {} } as {
          title: Record<string, string>
          createdAt: Record<string, Date>
          creatorId: Record<string, string[]>
        },
      )

    if (filterParams) Object.keys(filterParams).forEach((k) => !Object.keys(filterParams[k]).length && delete filterParams[k])

    const sets = (await prisma.set.findMany({
      take: params?.limit ? params.limit + 1 : undefined,
      skip: params?.cursor ? 1 : 0,
      cursor: params?.cursor ? { id: params.cursor } : undefined,
      where: { userId: params?.id || session.id, ...filterParams },
      include: {
        user: { select: { name: true, image: true, id: true } },
        creator: { select: { name: true, image: true, id: true } },
      },
    })) as SelectedSet[]

    const count = await prisma.set.count({ where: { userId: params?.id || session.id, ...filterParams } })

    if (params?.cursor || params?.limit) {
      const limit = params?.limit || INFINITY_SCROLL_LIMIT
      const hasNextPage = sets.length > limit
      const items = hasNextPage ? sets.slice(0, -1) : sets

      return { sets: items, count, nextCursor: hasNextPage ? items[items.length - 1].id : null, error: null }
    }

    return { sets, error: null, count }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const getSetById = async (id: string, creatorId?: string): Promise<(SelectedSet & { error: null }) | Err> => {
  let set: SelectedSet | null

  const t = await getTranslations('error.set')

  try {
    const session = await getServerSessionToken()

    if (creatorId && creatorId !== session.id) {
      const sharedSet = await prisma.set.findFirst({ where: { id, creatorId }, omit: { id: true } })

      if (sharedSet) {
        set = (await prisma.set.create({
          data: { ...sharedSet, list: sharedSet.list as SetList, userId: session.id, creatorId },
        })) as SelectedSet
      } else throw Error(t('sharing'))
    } else
      set = (await prisma.set.findFirst({
        where: { id },
        include: {
          user: { select: { name: true, image: true, id: true } },
          creator: { select: { name: true, image: true, id: true } },
        },
      })) as SelectedSet

    if (set) return { ...(set as SelectedSet), error: null }
    else throw Error(t('notFound'))
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

export const getSetsCreators = async (): Promise<{ creatorList: SetCreator[]; error: null } | Err> => {
  try {
    const session = await getServerSessionToken()

    return {
      creatorList: await prisma.set.findMany({
        where: { userId: session.id },
        select: { creator: { select: { name: true, id: true } } },
        distinct: ['creatorId'],
      }),
      error: null,
    }
  } catch (error) {
    return errHandlerService(error)
  }
}
