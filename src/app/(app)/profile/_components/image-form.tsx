'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { User2 } from 'lucide-react'

import Spinner from '@/components/spinner'
import { Button } from '@/components/ui/button'

import { useToast } from '@/hooks/use-toast'
import { updateAccImage } from '@/actions/user'
import { deleteFile, uploadFile } from '@/actions/fileStorage'

export default function ChangeImageForm() {
  const [image, setImage] = useState<{ file: File | null; url: string | ArrayBuffer | null }>({ file: null, url: null })
  const [isLoading, setLoading] = useState(false)

  const { data: session, update } = useSession()
  const { toast } = useToast()

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (session?.user?.image && !image.url) setImage({ ...image, url: session?.user?.image })
  }, [session?.user?.image, image.url])

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
    setLoading(true)

    const isBucketImage = session?.user.image?.includes('amazonaws.com')

    try {
      if (isBucketImage) await deleteFile(session?.user.image)

      const res = await uploadFile(image.file!)

      if (res.error) throw Error('Uploaded image url not found')

      const updatedUser = await updateAccImage({ image: res.url })
      if (updatedUser.error) throw Error('Updated user error')

      await update({ image: res.url })

      setImage({ file: null, url: res.url })
      setLoading(false)

      toast({ title: 'Image Uploading', description: 'Image was uploaded successfully!', variant: 'success' })
    } catch (error) {
      console.log(error)

      const err = error as Error

      setLoading(false)

      toast({ title: 'File Type Error', description: err.message || 'Something went wrong', variant: 'destructive' })
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
    <>
      <div className="flex flex-col justify-center items-center">
        <h3 className="sub-title-3">Update image:</h3>
        <div>
          <input
            ref={inputRef}
            className="absolute h-[200px] w-[200px] opacity-0 cursor-pointer rounded-full"
            type="file"
            onChange={onChange}
          />
          {image.url ? (
            <Image
              className="rounded-full border-4 border-secondary object-cover w-[200px] h-[200px]"
              src={image.url as string}
              width={200}
              height={200}
              alt="user"
              priority
            />
          ) : (
            <div className="flex justify-center items-center rounded-full border-4 border-secondary w-[200px] h-[200px]">
              <User2 size={100} />
            </div>
          )}
          {!image.url && !session?.user.image ? (
            <Button className="mt-5 mx-auto block" onClick={() => inputRef.current?.click()}>
              Choose File
            </Button>
          ) : image.url !== session?.user.image ? (
            <div className="mt-5 gap-5 flex justify-center">
              <Button onClick={() => setImage({ file: null, url: session?.user.image })}>Cancel</Button>
              <Button onClick={upload}>Save</Button>
            </div>
          ) : (
            <div className="mt-5 gap-5 flex justify-center">
              <Button onClick={() => inputRef.current?.click()}>Update</Button>
              <Button onClick={onDelete}>Delete</Button>
            </div>
          )}
        </div>
        {isLoading && <Spinner />}
      </div>
    </>
  )
}
