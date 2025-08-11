import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import speakeasy from 'speakeasy'

import { Err } from '@/types/errTypes'
import getServerSessionToken from '@/helpers/getServerSessionToken'
import { appHost } from '@/utils/paths'

export async function GET(req: NextRequest): Promise<NextResponse<{ data: string; secret: string } | Err>> {
  try {
    const session = await getServerSessionToken(req)

    const secret = speakeasy.generateSecret({ name: appHost })
    const otpauthUrl = speakeasy.otpauthURL({ secret: secret.base32, label: session.email, issuer: appHost, encoding: 'base32' })

    const data = await QRCode.toDataURL(otpauthUrl)

    return NextResponse.json({ data, secret: secret.base32 })
  } catch (error) {
    const err = error as Error

    return NextResponse.json({ error: { message: err.message, statusCode: 400 } }, { status: 400 })
  }
}
