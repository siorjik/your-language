import { NextRequest, NextResponse } from 'next/server'

import { sendCreatePassMail } from '@/services/mailerService'
import { createToken } from '@/services/jwtService'
import { Err, ErrObj } from '@/types/errTypes'

export async function POST(req: NextRequest): Promise<NextResponse<{ success: true } | Err>> {
  const body = await req.json()

  try {
    const token = await createToken({ email: body.email }, 10)

    await sendCreatePassMail({ to: body.email, name: body.name, token })

    return NextResponse.json({ success: true })
  } catch (error) {
    const err = error as ErrObj | Error

    return NextResponse.json({ error: { message: err.message, statusCode: 400 } }, { status: 400 })
  }
}
