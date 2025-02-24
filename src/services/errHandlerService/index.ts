import { Prisma } from '@prisma/client'

import dbErrHandlerService from './dbErrHandlerService'
import { Err } from '@/types/errTypes'

const { PrismaClientKnownRequestError } = Prisma

export default (error: unknown): Err => {
  if (error instanceof PrismaClientKnownRequestError) {
    console.error('errHandlerService - ', { ...(error as object) })
    return dbErrHandlerService(error)
  } else if (error instanceof Error) {
    console.error('errHandlerService - ', error)
    return { error: { message: error.message } }
  }

  return { error: { message: 'Undefined error in errHandlerService...' } }
}
