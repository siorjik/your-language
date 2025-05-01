'use server'

import { revalidatePath } from 'next/cache'
import z from 'zod'

import errHandlerService from '@/services/errHandlerService'
import { setFormTypeSchema } from '@/types/forms/set'
import getServerSessionToken from '@/helpers/getServerSessionToken'
import { prisma } from '@/lib/prisma'
import { setAppPath } from '@/utils/paths'
import { Set } from '@prisma/client'
import { Err } from '@/types/errTypes'

export const createSet = async (data: z.infer<typeof setFormTypeSchema>): Promise<(Set & { error: null }) | Err> => {
  try {
    setFormTypeSchema.parse(data)

    const session = await getServerSessionToken()

    const { title, source, target, list } = data

    revalidatePath(setAppPath)

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

    revalidatePath(setAppPath)

    return { ...(await prisma.set.update({ where: { id }, data: { title, source, target, list } })), error: null }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const getSetList = async (): Promise<{ sets: Set[]; error: null } | Err> => {
  try {
    const session = await getServerSessionToken()

    return { sets: await prisma.set.findMany({ where: { userId: session.id } }), error: null }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const getSetById = async (id: string): Promise<(Set & { error: null }) | Err> => {
  try {
    await getServerSessionToken()

    const set = await prisma.set.findFirst({ where: { id } })

    if (set) return { ...set, error: null }
    else throw Error('Set not found')
  } catch (error) {
    return errHandlerService(error)
  }
}

export const deleteSet = async (id: string): Promise<{ success: true; error: null } | Err> => {
  try {
    await getServerSessionToken()

    await prisma.set.delete({ where: { id } })

    revalidatePath(setAppPath)

    return { success: true, error: null }
  } catch (error) {
    return errHandlerService(error)
  }
}
