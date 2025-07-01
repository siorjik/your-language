import { NextRequest, NextResponse } from 'next/server'

import translateAIService from '@/services/translateAIService'
import { Err, ErrObj } from '@/types/errTypes'
import getServerSessionToken from '@/helpers/getServerSessionToken'

export async function POST(req: NextRequest): Promise<NextResponse<string[] | [] | Err>> {
  try {
    await getServerSessionToken(req)

    const { word, inputLanguage, outputLanguage } = await req.json()

    return NextResponse.json(word ? await translateAIService(word, inputLanguage!, outputLanguage!) : [])
    // return NextResponse.json(word ? ['1', '2', '3', '4', '5', '6', '7'] : [])
  } catch (error) {
    const err = error as ErrObj | Error

    return NextResponse.json({ error: { message: err.message, statusCode: 400 } }, { status: 400 })
  }
}
