import { Prisma } from '@prisma/client'

import { dbErrorList } from '@/utils/constants'

const { PrismaClientKnownRequestError } = Prisma

export default (error: unknown): { error: string } => {
  console.error({ ...(error as Error) })

  if (error instanceof PrismaClientKnownRequestError) {
    return { error: dbErrorList.find(item => item.code === error.code)?.message as string }
  }

  return { error: 'Something went wrong...' }
}
