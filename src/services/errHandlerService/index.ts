import { Prisma } from '@prisma/client'

import dbErrHandlerService from './dbErrHandlerService'
import { Err } from '@/types/errTypes'

const { PrismaClientKnownRequestError } = Prisma

export default (error: unknown): Err => {
  console.error('errHandlerService - ', { ...(error as object) })

  if (error instanceof PrismaClientKnownRequestError) {
    return dbErrHandlerService(error)
  } else if (error instanceof Error) {
    return { error: { message: error.message } }
  }

  return { error: { message: 'Something went wrong in errHandlerService...' } }
}
