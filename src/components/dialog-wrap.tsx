'use client'

import { ReactElement, useEffect, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from './ui/button'

type DialogProps = {
  trigger: ReactElement
  description?: string | null
  title: string
  content: ReactElement
  isAutoClose?: boolean
  width?: string
}

export default function DialogWrap({
  trigger,
  description = null,
  title,
  content,
  isAutoClose = false,
  width = '',
}: DialogProps) {
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    if (isAutoClose && isOpen) setOpen(false)
  }, [isAutoClose])

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className={`${width} gap-8`}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div>{content}</div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
