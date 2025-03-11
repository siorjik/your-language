import { NextRequest, NextResponse } from 'next/server'
import speakeasy from 'speakeasy'

import { Err } from '@/types/errTypes'

export async function POST(req: NextRequest): Promise<NextResponse<{ verified: boolean } | Err>> {
  const body = await req.json()

  try {
    const verified = speakeasy.totp.verify({ secret: body.secret as string, encoding: 'base32', token: body.code as string })

    return NextResponse.json({ verified })
  } catch (error) {
    const err = error as Error

    return NextResponse.json({ error: { message: err.message, statusCode: 400 } }, { status: 400 })
  }
}
