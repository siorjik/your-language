import { NextRequest, NextResponse } from 'next/server'

import translateAIService from '@/services/translateAIService'
import { Err, ErrObj } from '@/types/errTypes'

export async function POST(req: NextRequest): Promise<NextResponse<string[] | [] | Err>> {
  try {
    const { word, inputLanguage, outputLanguage } = await req.json()

    return NextResponse.json(word ? await translateAIService(word, inputLanguage!, outputLanguage!) : [])
  } catch (error) {
    const err = error as ErrObj | Error

    return NextResponse.json({ error: { message: err.message, statusCode: 400 } }, { status: 400 })
  }
}
