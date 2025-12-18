'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import Spinner from '@/components/spinner'
import { Button } from '@/components/ui/button'

import { useToast } from '@/hooks/use-toast'
import { BLURRED_DATA_URL } from '@/utils/constants'

export default function ImageUploading({
  imageUrl = null,
  upload,
  onDelete,
  placeholder,
  getImage,
}: {
  imageUrl?: string | null
  upload?: (image: File) => Promise<string | null>
  onDelete?: () => Promise<void>
  placeholder: ReactNode
  getImage?: (image: File) => void
}) {
  const [image, setImage] = useState<{ file: File | null; url: string | ArrayBuffer | null }>({ file: null, url: null })
  const [isLoading, setLoading] = useState(false)

  const { toast } = useToast()
  const t = useTranslations('btn')
  const tToast = useTranslations('toast.imageUploading')

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (imageUrl && !image.url) setImage({ ...image, url: imageUrl })
  }, [imageUrl, image.url])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileMb = 1024 * 1024 * 10 // 10Mb

    if (e.target.files) {
      const file = e.target.files[0]
      const ext = file.name.substring(file.name.lastIndexOf('.') + 1)
      const isAllowedSize = file.size < fileMb

      getImage?.(file)

      if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg') {
        toast({ title: tToast('incorrectType.title'), description: tToast('incorrectType.description'), variant: 'destructive' })
        return
      }

      if (!isAllowedSize) {
        toast({ title: tToast('incorrectSize.title'), description: tToast('incorrectSize.description'), variant: 'destructive' })
        return
      }

      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        setImage({ file, url: reader.result })
      }
    }
  }

  return (
    <>
      <div className="w-fit flex flex-col justify-center items-center">
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
              placeholder="blur"
              blurDataURL={BLURRED_DATA_URL}
            />
          ) : (
            <div className="flex justify-center items-center rounded-full border-4 border-secondary w-[200px] h-[200px]">
              {placeholder}
            </div>
          )}
          {!image.url && !imageUrl ? (
            <Button type="button" className="mt-5 mx-auto block" onClick={() => inputRef.current?.click()}>
              {t('chooseFile')}
            </Button>
          ) : image.url !== imageUrl ? (
            <div className="mt-5 gap-5 flex justify-center">
              <Button type="button" onClick={() => setImage({ file: null, url: imageUrl })}>
                {t('cancel')}
              </Button>
              {upload && (
                <Button
                  type="button"
                  onClick={async () => {
                    setLoading(true)

                    const res = await upload?.(image.file!)

                    setImage({ file: null, url: res || null })
                    setLoading(false)
                  }}
                >
                  {t('save')}
                </Button>
              )}
            </div>
          ) : (
            <div className="mt-5 gap-5 flex justify-center">
              <Button type="button" onClick={() => inputRef.current?.click()}>
                {t('update')}
              </Button>
              <Button
                type="button"
                onClick={async () => {
                  setLoading(true)

                  await onDelete?.()

                  setLoading(false)
                }}
              >
                {t('delete')}
              </Button>
            </div>
          )}
        </div>
        {isLoading && <Spinner />}
      </div>
    </>
  )
}
