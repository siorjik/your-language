import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import speakeasy from 'speakeasy'

import { Err } from '@/types/errTypes'
import getServerSessionToken from '@/helpers/getServerSessionToken'

export async function GET(req: NextRequest): Promise<NextResponse<{ data: string; secret: string } | Err>> {
  try {
    await getServerSessionToken(req)

    const secret = speakeasy.generateSecret({ name: 'your-language' })
    const otpauthUrl = speakeasy.otpauthURL({ secret: secret.base32, label: 'label', issuer: 'issuer', encoding: 'base32' })

    const data = await QRCode.toDataURL(otpauthUrl)

    return NextResponse.json({ data, secret: secret.base32 })
  } catch (error) {
    const err = error as Error

    return NextResponse.json({ error: { message: err.message, statusCode: 400 } }, { status: 400 })
  }
}
