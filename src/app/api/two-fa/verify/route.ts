import { NextRequest, NextResponse } from 'next/server'
import speakeasy from 'speakeasy'

import { Err } from '@/types/errTypes'
import getServerSessionToken from '@/helpers/getServerSessionToken'

export async function POST(req: NextRequest): Promise<NextResponse<{ verified: boolean } | Err>> {
  const body = await req.json()

  try {
    await getServerSessionToken()

    const verified = speakeasy.totp.verify({ secret: body.secret as string, encoding: 'base32', token: body.token as string })

    return NextResponse.json({ verified })
  } catch (error) {
    const err = error as Error

    return NextResponse.json({ error: { message: err.message, statusCode: 400 } }, { status: 400 })
  }
}
