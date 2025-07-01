import { NextRequest, NextResponse } from 'next/server'

import dictionaryAIService from '@/services/dictionaryAIService'
import dictionaryService from '@/services/dictionaryService'
import { ErrObj, Err } from '@/types/errTypes'
import getServerSessionToken from '@/helpers/getServerSessionToken'

type LanguageType = 'en' | 'ru' | 'ua'

export async function POST(req: NextRequest): Promise<NextResponse<string[] | Err>> {
  let res: string[] = []
  let resp: { words: string[] } = { words: [] }

  try {
    await getServerSessionToken(req)

    const { word, language } = (await req.json()) as { word: string; language: LanguageType }

    if (word) {
      if (language !== 'en') resp = await dictionaryAIService(word, language!)
      else resp = await dictionaryService(word)

      res = resp.words.length ? resp.words : [word]
    }

    return NextResponse.json(res)
  } catch (error) {
    const err = error as ErrObj | Error

    return NextResponse.json({ error: { message: err.message, statusCode: 400 } }, { status: 400 })
  }
}
