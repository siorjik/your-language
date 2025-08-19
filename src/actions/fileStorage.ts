'use server'

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import getServerSessionToken from '@/helpers/getServerSessionToken'
import errHandlerService from '@/services/errHandlerService'
import { Err } from '@/types/errTypes'

const s3 = new S3Client({
  region: process.env.AWS_DEFAULT_REGION!,
  credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID!, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY! },
})

export const uploadFile = async (file: File): Promise<{ url: string; error: null } | Err> => {
  try {
    await getServerSessionToken()

    const putObjectCommand = new PutObjectCommand({ Key: file.name, Bucket: process.env.AWS_BUCKET_NAME })

    const signedUrl = await getSignedUrl(s3, putObjectCommand, { expiresIn: 60 })

    await fetch(signedUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file })

    return { url: signedUrl.split('?')[0], error: null }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const deleteFile = async (name: string): Promise<{ success: boolean; error: null } | Err> => {
  try {
    await getServerSessionToken()

    const params = { Bucket: process.env.AWS_BUCKET_NAME, Key: name.slice(name.lastIndexOf('/') + 1) }

    await s3.send(new DeleteObjectCommand(params))

    return { success: true, error: null }
  } catch (error) {
    return errHandlerService(error)
  }
}
