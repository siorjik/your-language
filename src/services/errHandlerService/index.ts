import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'

import dbErrHandlerService from './dbErrHandlerService'
import { Err } from '@/types/errTypes'

const { PrismaClientKnownRequestError } = Prisma

export default (error: unknown): Err => {
  if (error instanceof PrismaClientKnownRequestError) {
    console.log('PrismaError in errHandlerService - ', { ...(error as object) })
    return dbErrHandlerService(error)
  } else if (error instanceof ZodError) {
    console.log('ZodError in errHandlerService - ', error)
    return { error: { message: error.errors[0].message } }
  } else if (error instanceof Error) {
    console.log('Error in errHandlerService - ', error)
    return { error: { message: error.message } }
  }

  return { error: { message: 'Undefined error in errHandlerService...' } }
}
