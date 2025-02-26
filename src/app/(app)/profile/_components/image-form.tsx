'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSession, useSession } from 'next-auth/react'
import Image from 'next/image'

import Spinner from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'

import useFileStorage from '@/hooks/useFileStorage'
import { useToast } from '@/hooks/use-toast'
import FileStorageService from '@/services/fileStorageService'
import { updateAccImage } from '@/actions/user'

const fileStorage = new FileStorageService()

export default function ChangeImageForm() {
  const [image, setImage] = useState<{ file: File | null; url: string | ArrayBuffer | null }>({ file: null, url: null })
  const [isLoading, setLoading] = useState(false)

  const { data: session, update } = useSession()
  const { toast } = useToast()
  const { getAuthUrl } = useFileStorage()

  const getAuthUrlCallback = useCallback(() => getAuthUrl(session?.user?.image as string), [])

  useEffect(() => {
    if (session?.user?.image && !image.url) setImage({ ...image, url: getAuthUrlCallback() })
  }, [getAuthUrlCallback, session?.user?.image, image.url])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileMb = 1024 * 1024 * 10 // 10Mb

    if (e.target.files) {
      const file = e.target.files[0]
      const ext = file.name.substring(file.name.lastIndexOf('.') + 1)
      const isAllowedSize = file.size < fileMb

      if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg') {
        toast({
          title: 'File Type Error',
          description: 'File type not supported! Need to be .png, .jpg or .jpeg!',
          variant: 'destructive',
        })
        return
      }

      if (!isAllowedSize) {
        toast({
          title: 'File Size Error',
          description: 'File size too large! Need to be less than 10Mb!',
          variant: 'destructive',
        })
        return
      }

      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        setImage({ file, url: reader.result })
      }
    }
  }

  const upload = async (): Promise<void> => {
    await getSession()

    setLoading(true)

    try {
      const url = await fileStorage.uploadFile(image?.url as string, image.file?.name as string)
      if (!url) throw Error('Uploaded image url not found')

      const updatedUser = await updateAccImage({ image: url })
      if (updatedUser.error) throw Error('Updated user error')

      update({ image: url })

      setImage({ file: null, url: getAuthUrl(url) })
      setLoading(false)

      toast({ title: 'Image Uploading', description: 'Image was uploaded successfully!', variant: 'success' })
    } catch (error) {
      console.log(error)

      const err = error as Error

      setLoading(false)

      toast({ title: 'File Type Error', description: err.message || 'Something went wrong', variant: 'destructive' })
    }
  }

  const showControlBlock = image.url && !String(image.url).includes('https')

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div>
          <input className="absolute h-[200px] w-[200px] opacity-0 cursor-pointer rounded-full" type="file" onChange={onChange} />
          {image.url ? (
            <Image
              className="rounded-full border-4 border-pink-400 object-cover w-[200px] h-[200px]"
              src={image.url as string}
              width={200}
              height={200}
              alt="user"
            />
          ) : (
            <div className="flex justify-center items-center rounded-full border-4 border-pink-400 w-[200px] h-[200px]">
              <User size={100} />
            </div>
          )}
          {showControlBlock && (
            <div className="mt-5 gap-5 flex justify-center">
              <Button onClick={() => setImage({ file: null, url: null })}>Cancel</Button>
              <Button onClick={upload}>Save</Button>
            </div>
          )}
        </div>
        {isLoading && <Spinner />}
      </div>
    </>
  )
}
