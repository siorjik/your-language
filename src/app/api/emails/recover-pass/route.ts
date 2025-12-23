import { NextRequest, NextResponse } from 'next/server'
import { getTranslations } from 'next-intl/server'

import { sendRecoverPassMail } from '@/services/mailerService'
import { createToken } from '@/services/jwtService'
import { Err, ErrObj } from '@/types/errTypes'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest): Promise<NextResponse<{ success: boolean } | Err>> {
  const { email, locale } = await req.json()

  const t = await getTranslations({ locale, namespace: 'error.recoverPass' })

  try {
    const user = await prisma.user.findFirst({ where: { email } })

    if (!user) throw Error(t('emailNotFound'))

    const token = await createToken({ email })

    await sendRecoverPassMail({ to: email, token, locale })

    return NextResponse.json({ success: true })
  } catch (error) {
    const err = error as ErrObj | Error

    return NextResponse.json({ error: { message: err.message, statusCode: 400 } }, { status: 400 })
  }
}
