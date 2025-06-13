'use server'

import { revalidatePath } from 'next/cache'
import z from 'zod'

import errHandlerService from '@/services/errHandlerService'
import { setFormTypeSchema } from '@/types/forms/set'
import getServerSessionToken from '@/helpers/getServerSessionToken'
import { prisma } from '@/lib/prisma'
import { setsAppPath } from '@/utils/paths'
import { Set } from '@prisma/client'
import { Err } from '@/types/errTypes'

export const createSet = async (data: z.infer<typeof setFormTypeSchema>): Promise<(Set & { error: null }) | Err> => {
  try {
    setFormTypeSchema.parse(data)

    const session = await getServerSessionToken()

    const { title, source, target, list } = data

    revalidatePath(setsAppPath)

    return { ...(await prisma.set.create({ data: { title, source, target, list, userId: session.id } })), error: null }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const updateSet = async (data: z.infer<typeof setFormTypeSchema>): Promise<(Set & { error: null }) | Err> => {
  try {
    setFormTypeSchema.parse(data)

    await getServerSessionToken()

    const { title, source, target, list, id } = data

    revalidatePath(setsAppPath)

    return { ...(await prisma.set.update({ where: { id }, data: { title, source, target, list } })), error: null }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const getSetList = async (
  filter: { title: string } | null = null,
): Promise<{ sets: Set[]; filtered: Set[]; error: null } | Err> => {
  try {
    const session = await getServerSessionToken()

    return {
      sets: await prisma.set.findMany({ where: { userId: session.id } }),
      filtered: filter ? await prisma.set.findMany({ where: { userId: session.id, title: { contains: filter?.title } } }) : [],
      error: null,
    }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const getSetById = async (id: string): Promise<(Set & { error: null }) | Err> => {
  try {
    const session = await getServerSessionToken()

    const set = await prisma.set.findFirst({ where: { id, userId: session.id } })

    if (set) return { ...set, error: null }
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
