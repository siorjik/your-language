import { NextRequest, NextResponse } from 'next/server'
import { getTranslations } from 'next-intl/server'

import { Err, ErrObj } from '@/types/errTypes'
import getServerSessionToken from '@/helpers/getServerSessionToken'
import associationAIService from '@/services/associationAIService'
import getLocaleByReferer from '@/helpers/getLocaleByReferer'

export async function POST(req: NextRequest): Promise<NextResponse<string[] | [] | Err>> {
  const locale = await getLocaleByReferer()
  const t = await getTranslations({ locale, namespace: 'error.associations' })

  try {
    await getServerSessionToken(req)

    const body = await req.json()
    const word = (body?.word || '').trim()
    const language = (body?.language || 'en').trim()

    if (!word) throw Error(t('missing'))

    const stream = await associationAIService(word, language)

    return new NextResponse(stream, { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    const err = error as ErrObj | Error

    return NextResponse.json({ error: { message: err.message, statusCode: 400 } }, { status: 400 })
  }
}
