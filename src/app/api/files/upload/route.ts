import { NextRequest, NextResponse } from 'next/server'
import B2 from 'backblaze-b2'

import { Err } from '@/types/errTypes'

const storageKeyId = process.env.STORAGE_ACCESS_KEY_ID!
const storageKey = process.env.STORAGE_ACCESS_KEY!
const storageId = process.env.STORAGE_ID!
const storageName = process.env.STORAGE_NAME!

const b2 = new B2({ applicationKeyId: storageKeyId, applicationKey: storageKey })

export async function POST(req: NextRequest): Promise<NextResponse<string | Err>> {
  const { file } = await req.json()
  const fileName = req.headers.get('x-file-name')

  try {
    const { data } = await b2.authorize()

    const preparedFile = file.replace(/^data:image\/\w+;base64,/, '')
    const buf = Buffer.from(preparedFile, 'base64')

    const { data: uploadData } = await b2.getUploadUrl({ bucketId: storageId })

    await b2.uploadFile({
      uploadUrl: uploadData.uploadUrl,
      uploadAuthToken: uploadData.authorizationToken,
      fileName: `images/${fileName}`,
      data: buf,
    })

    const url = `${data.downloadUrl}/file/${storageName}/images/${fileName}`

    return NextResponse.json(url)
  } catch (error) {
    const err = error as Error

    return NextResponse.json({ error: { message: err.message, statusCode: 400 } }, { status: 400 })
  }
}
