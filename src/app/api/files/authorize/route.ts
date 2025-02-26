import { NextResponse } from 'next/server'
import B2 from 'backblaze-b2'

import { Err } from '@/types/errTypes'

const storageKeyId = process.env.STORAGE_ACCESS_KEY_ID!
const storageKey = process.env.STORAGE_ACCESS_KEY!

const b2 = new B2({ applicationKeyId: storageKeyId, applicationKey: storageKey })

export async function GET(): Promise<NextResponse<{ authToken: string; downloadUrl: string } | Err>> {
  try {
    const storageAuth = await b2.authorize()

    return NextResponse.json({ ...storageAuth.data })
  } catch (error) {
    const err = error as Error

    return NextResponse.json({ error: { message: err.message, statusCode: 400 } }, { status: 400 })
  }
}
