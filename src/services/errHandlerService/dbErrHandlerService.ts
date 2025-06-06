import { Prisma } from '@prisma/client'

import { DB_ERROR_LIST } from '@/utils/constants'
import { Err } from '@/types/errTypes'

const { PrismaClientKnownRequestError } = Prisma

export default (error: unknown): Err => {
  console.error('dbErrHandler', { ...(error as object) })

  if (error instanceof PrismaClientKnownRequestError) {
    return { error: { message: DB_ERROR_LIST.find((item) => item.code === error.code)?.message as string } }
  }

  return { error: { message: 'Undefined error in dbErrHandler...' } }
}
