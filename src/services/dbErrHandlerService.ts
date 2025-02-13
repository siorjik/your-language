import { Prisma } from '@prisma/client'

const { PrismaClientKnownRequestError } = Prisma

export default (error: unknown): { error: string } => {
  console.log({ ...(error as Error) })

  let err

  if (error instanceof PrismaClientKnownRequestError) {
    err = { ...error }

    if (err.code === 'P2002') return { error: 'This email already exists!' }
  }

  return { error: 'Something went wrong...' }
}
