'use client'

import { useSession } from 'next-auth/react'
import { User2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useToast } from '@/hooks/use-toast'
import { updateAccImage } from '@/actions/user'
import { deleteFile, uploadFile } from '@/actions/fileStorage'
import ImageUploading from '@/components/image-uploading'

export default function ImageForm() {
  const { data: session, update } = useSession()
  const { toast } = useToast()
  const t = useTranslations('Profile')
  const tToast = useTranslations('toast.profile.image')

  const upload = async (image: File): Promise<string | null> => {
    const isBucketImage = session?.user.image?.includes('amazonaws.com')

    try {
      if (isBucketImage) await deleteFile(session?.user.image)

      const res = await uploadFile(image!)

      if (res.error) throw Error(tToast('destructive.imageErr'))

      const updatedUser = await updateAccImage({ image: res.url })
      if (updatedUser.error) throw Error(tToast('destructive.userErr'))

      await update({ image: res.url })

      toast({ title: tToast('success.title'), description: tToast('success.description'), variant: 'success' })

      return res.url
    } catch (error) {
      console.log(error)

      const err = error as Error

      toast({
        title: tToast('destructive.title'),
        description: err.message || tToast('destructive.description'),
        variant: 'destructive',
      })

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
      <h3 className="sub-title-3">{t('updateImage')}:</h3>
      <ImageUploading imageUrl={session?.user.image} upload={upload} onDelete={onDelete} placeholder={<User2 size={100} />} />
    </div>
  )
}
