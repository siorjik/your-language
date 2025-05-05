import { NextRequest, NextResponse } from 'next/server'

import { sendRecoverPassMail } from '@/services/mailerService'
import { createToken } from '@/services/jwtService'
import { Err, ErrObj } from '@/types/errTypes'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest): Promise<NextResponse<{ success: boolean } | Err>> {
  const { email } = await req.json()

  try {
    const user = await prisma.user.findFirst({ where: { email } })

    if (!user) throw Error('User with this email does not exist!')

    const token = await createToken({ email })

    await sendRecoverPassMail({ to: email, token })

    return NextResponse.json({ success: true })
  } catch (error) {
    const err = error as ErrObj | Error

    return NextResponse.json({ error: { message: err.message, statusCode: 400 } }, { status: 400 })
  }
}
