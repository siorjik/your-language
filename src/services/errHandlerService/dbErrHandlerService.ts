import { Prisma } from '@prisma/client'

import { dbErrorList } from '@/utils/constants'
import { Err } from '@/types/errTypes'

const { PrismaClientKnownRequestError } = Prisma

export default (error: unknown): Err => {
  console.error('dbErrHandler', { ...(error as object) })

  if (error instanceof PrismaClientKnownRequestError) {
    return { error: { message: dbErrorList.find((item) => item.code === error.code)?.message as string } }
  }

  return { error: { message: 'Something went wrong in dbErrHandler...' } }
}
