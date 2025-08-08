import { NextRequest, NextResponse } from 'next/server'
import B2 from 'backblaze-b2'

import { Err } from '@/types/errTypes'
import getServerSessionToken from '@/helpers/getServerSessionToken'

const storageKeyId = process.env.STORAGE_ACCESS_KEY_ID!
const storageKey = process.env.STORAGE_ACCESS_KEY!

const b2 = new B2({ applicationKeyId: storageKeyId, applicationKey: storageKey })

export async function GET(req: NextRequest): Promise<NextResponse<{ authToken: string; downloadUrl: string } | Err>> {
  console.log('req in route - ', req)
  try {
    await getServerSessionToken(req)

    const storageAuth = await b2.authorize()

    return NextResponse.json({ ...storageAuth.data })
  } catch (error) {
    const err = error as Error

    return NextResponse.json({ error: { message: err.message, statusCode: 400 } }, { status: 400 })
  }
}
