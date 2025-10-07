import { NextRequest, NextResponse } from 'next/server'

import { sendContactUsMail } from '@/services/mailerService'
import { Err, ErrObj } from '@/types/errTypes'

export async function POST(req: NextRequest): Promise<NextResponse<{ success: true } | Err>> {
  const body = await req.json()

  try {
    await sendContactUsMail({ email: body.email, subject: body.subject, text: body.text })

    return NextResponse.json({ success: true })
  } catch (error) {
    const err = error as ErrObj | Error

    return NextResponse.json({ error: { message: err.message, statusCode: 400 } }, { status: 400 })
  }
}
