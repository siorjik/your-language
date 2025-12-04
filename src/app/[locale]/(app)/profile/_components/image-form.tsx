'use client'

import { useSession } from 'next-auth/react'
import { User2 } from 'lucide-react'

import { useToast } from '@/hooks/use-toast'
import { updateAccImage } from '@/actions/user'
import { deleteFile, uploadFile } from '@/actions/fileStorage'
import ImageUploading from '@/components/image-uploading'

export default function ImageForm() {
  const { data: session, update } = useSession()
  const { toast } = useToast()

  const upload = async (image: File): Promise<string | null> => {
    const isBucketImage = session?.user.image?.includes('amazonaws.com')

    try {
      if (isBucketImage) await deleteFile(session?.user.image)

      const res = await uploadFile(image!)

      if (res.error) throw Error('Uploaded image url not found')

      const updatedUser = await updateAccImage({ image: res.url })
      if (updatedUser.error) throw Error('Updated user error')

      await update({ image: res.url })

      toast({ title: 'Image Uploading', description: 'Image was uploaded successfully!', variant: 'success' })

      return res.url
    } catch (error) {
      console.log(error)

      const err = error as Error

      toast({ title: 'File Type Error', description: err.message || 'Something went wrong', variant: 'destructive' })

      return null
    }
  }

  const onDelete = async () => {
    const isBucketImage = session?.user.image.includes('amazonaws.com')

    try {
      if (isBucketImage) await deleteFile(session?.user.image)

      await updateAccImage({ image: null })

      await update({ image: null })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <h3 className="sub-title-3">Update image:</h3>
      <ImageUploading imageUrl={session?.user.image} upload={upload} onDelete={onDelete} placeholder={<User2 size={100} />} />
    </div>
  )
}
